import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { chatLegal, getAvailableProviders } from '@/lib/ai'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { pregunta, provider } = body

  if (!pregunta || pregunta.length < 5) {
    return NextResponse.json({ error: 'La pregunta debe tener al menos 5 caracteres' }, { status: 400 })
  }

  try {
    const resultado = await chatLegal(pregunta, session.user.id, provider)
    return NextResponse.json({
      respuesta: resultado.respuesta,
      provider: resultado.provider
    })
  } catch (error: any) {
    console.error('Error en chat:', error)
    return NextResponse.json({
      error: error.message || 'Error al procesar la consulta'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const historial = await prisma.chatHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  // Devolver tambien los proveedores disponibles
  const providers = getAvailableProviders()

  return NextResponse.json({ historial, providers })
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    await prisma.chatHistory.deleteMany({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ success: true, message: 'Historial eliminado' })
  } catch (error) {
    console.error('Error deleting chat history:', error)
    return NextResponse.json({ error: 'Error al eliminar el historial' }, { status: 500 })
  }
}
