import { prisma } from './prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Tipos de proveedores disponibles
type AIProvider = 'gemini' | 'groq' | 'openai'

interface AIResponse {
  respuesta: string
  provider: AIProvider
}

// Configuracion de proveedores en orden de prioridad
const PROVIDERS: AIProvider[] = ['gemini', 'groq', 'openai']

// Prompt base para asistente juridico
const SYSTEM_PROMPT = `Eres un asistente juridico especializado en legislacion chilena.
Tu rol es ayudar a abogados de la Direccion Juridica Municipal con consultas legales.
Responde de manera profesional, clara y concisa.
Cita fuentes legales cuando sea posible (leyes, articulos, jurisprudencia).
Si no tienes informacion suficiente o la consulta esta fuera de tu conocimiento, indicalo claramente.
Responde siempre en espanol.`

// Llamar a Gemini
async function callGemini(prompt: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no configurada')
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const result = await model.generateContent(prompt)
  return result.response.text() || ''
}

// Llamar a Groq (backup gratuito y rapido)
async function callGroq(prompt: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY no configurada')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant', // Modelo gratuito y rapido
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// Llamar a OpenAI (backup adicional si se configura)
async function callOpenAI(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no configurada')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// Funcion principal con fallback automatico
async function callAIWithFallback(prompt: string, preferredProvider?: AIProvider): Promise<AIResponse> {
  // Si hay proveedor preferido, ponerlo primero
  const providers = preferredProvider
    ? [preferredProvider, ...PROVIDERS.filter(p => p !== preferredProvider)]
    : PROVIDERS

  const errors: string[] = []

  for (const provider of providers) {
    try {
      let respuesta = ''

      switch (provider) {
        case 'gemini':
          if (process.env.GEMINI_API_KEY) {
            respuesta = await callGemini(prompt)
          } else {
            continue
          }
          break

        case 'groq':
          if (process.env.GROQ_API_KEY) {
            respuesta = await callGroq(prompt)
          } else {
            continue
          }
          break

        case 'openai':
          if (process.env.OPENAI_API_KEY) {
            respuesta = await callOpenAI(prompt)
          } else {
            continue
          }
          break
      }

      if (respuesta) {
        return { respuesta, provider }
      }
    } catch (error: any) {
      errors.push(`${provider}: ${error.message}`)
      console.error(`Error con ${provider}:`, error.message)
      // Continuar con el siguiente proveedor
    }
  }

  throw new Error(`Todos los proveedores fallaron: ${errors.join(', ')}`)
}

// Funcion principal exportada
export async function chatLegal(pregunta: string, userId: string, preferredProvider?: AIProvider) {
  // Buscar documentos relevantes para contexto
  const documentos = await prisma.documento.findMany({
    where: {
      activo: true,
      OR: [
        { titulo: { contains: pregunta, mode: 'insensitive' } },
        { contenido: { contains: pregunta, mode: 'insensitive' } },
        { resumen: { contains: pregunta, mode: 'insensitive' } }
      ]
    },
    take: 5,
    select: {
      titulo: true,
      categoria: true,
      resumen: true,
      contenido: true
    }
  })

  const contexto = documentos.length > 0
    ? `Documentos relevantes encontrados en la base de datos:\n${documentos.map(d =>
        `- ${d.titulo} (${d.categoria}): ${d.resumen}\nContenido: ${d.contenido.substring(0, 1000)}...`
      ).join('\n\n')}`
    : 'No se encontraron documentos especificos en la base de datos para esta consulta.'

  const prompt = `${contexto}\n\nPregunta del usuario: ${pregunta}`

  // Llamar a la IA con fallback
  const { respuesta, provider } = await callAIWithFallback(prompt, preferredProvider)

  // Guardar en historial con el proveedor usado
  await prisma.chatHistory.create({
    data: {
      userId,
      pregunta,
      respuesta: `[${provider.toUpperCase()}] ${respuesta}`
    }
  })

  return { respuesta, provider }
}

// Obtener proveedores disponibles
export function getAvailableProviders(): AIProvider[] {
  const available: AIProvider[] = []
  if (process.env.GEMINI_API_KEY) available.push('gemini')
  if (process.env.GROQ_API_KEY) available.push('groq')
  if (process.env.OPENAI_API_KEY) available.push('openai')
  return available
}
