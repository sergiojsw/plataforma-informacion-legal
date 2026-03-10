import { prisma } from './prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Tipos de proveedores GRATUITOS disponibles
type AIProvider = 'gemini' | 'groq' | 'cohere'

interface AIResponse {
  respuesta: string
  provider: AIProvider
}

// Configuracion de proveedores gratuitos en orden de prioridad
const PROVIDERS: AIProvider[] = ['gemini', 'groq', 'cohere']

// Info de proveedores
export const PROVIDER_INFO: Record<AIProvider, { name: string; free: boolean; limit: string; url: string }> = {
  gemini: { name: 'Gemini', free: true, limit: '1500 req/dia', url: 'https://aistudio.google.com/apikey' },
  groq: { name: 'Groq', free: true, limit: '30 req/min', url: 'https://console.groq.com/keys' },
  cohere: { name: 'Cohere', free: true, limit: '1000 req/mes', url: 'https://dashboard.cohere.com/api-keys' }
}

// Prompt base para asistente juridico
const SYSTEM_PROMPT = `Eres un asistente juridico especializado en legislacion chilena.
Tu rol es ayudar a abogados de la Direccion Juridica Municipal con consultas legales.
Responde de manera profesional, clara y concisa.
Cita fuentes legales cuando sea posible (leyes, articulos, jurisprudencia).
Si no tienes informacion suficiente o la consulta esta fuera de tu conocimiento, indicalo claramente.
Responde siempre en espanol.`

// Llamar a Gemini (Google - GRATIS)
async function callGemini(prompt: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no configurada')
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n${prompt}`)
  return result.response.text() || ''
}

// Llamar a Groq (GRATIS - muy rapido)
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
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Groq error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// Llamar a Cohere (GRATIS - 1000 req/mes)
async function callCohere(prompt: string): Promise<string> {
  if (!process.env.COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY no configurada')
  }

  const response = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'command-light',
      message: prompt,
      preamble: SYSTEM_PROMPT,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Cohere error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.text || ''
}

// Funcion principal con fallback automatico entre IAs gratuitas
async function callAIWithFallback(prompt: string, preferredProvider?: AIProvider): Promise<AIResponse> {
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
          } else continue
          break

        case 'groq':
          if (process.env.GROQ_API_KEY) {
            respuesta = await callGroq(prompt)
          } else continue
          break

        case 'cohere':
          if (process.env.COHERE_API_KEY) {
            respuesta = await callCohere(prompt)
          } else continue
          break
      }

      if (respuesta) {
        return { respuesta, provider }
      }
    } catch (error: any) {
      errors.push(`${provider}: ${error.message}`)
      console.error(`Error con ${provider}:`, error.message)
    }
  }

  throw new Error(`Todas las IAs fallaron. Intenta mas tarde o selecciona otra IA.\n${errors.join('\n')}`)
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
    ? `Documentos relevantes encontrados:\n${documentos.map(d =>
        `- ${d.titulo} (${d.categoria}): ${d.resumen}\nContenido: ${d.contenido.substring(0, 1000)}...`
      ).join('\n\n')}`
    : 'No se encontraron documentos especificos en la base de datos.'

  const prompt = `${contexto}\n\nPregunta: ${pregunta}`

  const { respuesta, provider } = await callAIWithFallback(prompt, preferredProvider)

  // Guardar en historial
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
  if (process.env.COHERE_API_KEY) available.push('cohere')
  return available
}
