import { prisma } from './prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function chatLegal(pregunta: string, userId: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY no configurada. Obtén tu API key gratuita en https://aistudio.google.com/apikey')
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

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

  const prompt = `Eres un asistente jurídico especializado en legislación chilena.
Tu rol es ayudar a abogados de la Dirección Jurídica Municipal con consultas legales.
Responde de manera profesional, clara y concisa.
Cita fuentes legales cuando sea posible (leyes, artículos, jurisprudencia).
Si no tienes información suficiente o la consulta está fuera de tu conocimiento, indícalo claramente.
Responde siempre en español.

${contexto}

Pregunta del usuario: ${pregunta}`

  const result = await model.generateContent(prompt)
  const respuesta = result.response.text() || 'No se pudo generar una respuesta.'

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
