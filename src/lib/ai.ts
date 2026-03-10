import { prisma } from './prisma'
import Groq from 'groq-sdk'

// Groq es gratuito - obtener API key en https://console.groq.com
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
})

export async function chatLegal(pregunta: string, userId: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY no configurada. Obtén tu API key gratuita en https://console.groq.com')
  }

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
    : 'No se encontraron documentos específicos en la base de datos para esta consulta.'

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `Eres un asistente jurídico especializado en legislación chilena.
Tu rol es ayudar a abogados de la Dirección Jurídica Municipal con consultas legales.
Responde de manera profesional, clara y concisa.
Cita fuentes legales cuando sea posible (leyes, artículos, jurisprudencia).
Si no tienes información suficiente o la consulta está fuera de tu conocimiento, indícalo claramente.
Responde siempre en español.

${contexto}`
      },
      {
        role: 'user',
        content: pregunta
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  })

  const respuesta = completion.choices[0]?.message?.content || 'No se pudo generar una respuesta.'

  // Guardar en historial
  await prisma.chatHistory.create({
    data: {
      userId,
      pregunta,
      respuesta
    }
  })

  return respuesta
}
