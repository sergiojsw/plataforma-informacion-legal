import OpenAI from 'openai'
import { prisma } from './prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function chatLegal(pregunta: string, userId: string) {
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
    : 'No se encontraron documentos específicos en la base de datos.'

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Eres un asistente jurídico especializado en legislación chilena.
Tu rol es ayudar a abogados municipales con consultas legales.
Responde de manera profesional, citando fuentes cuando sea posible.
Si no tienes información suficiente, indícalo claramente.

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
