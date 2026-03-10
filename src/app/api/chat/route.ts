import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { chatLegal, getAvailableProviders, getVisionProviders } from '@/lib/ai'
import { prisma } from '@/lib/prisma'

// Limite de tamaño de imagen: 10MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { pregunta, provider, image } = body

  if (!pregunta || pregunta.length < 3) {
    return NextResponse.json({ error: 'La pregunta debe tener al menos 3 caracteres' }, { status: 400 })
  }

  // Validar imagen si existe
  let imageData = undefined
  if (image) {
    // Verificar formato
    if (!image.base64 || !image.mimeType) {
      return NextResponse.json({ error: 'Formato de imagen invalido' }, { status: 400 })
    }

    // Verificar tipo MIME permitido
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(image.mimeType)) {
      return NextResponse.json({ error: 'Tipo de imagen no soportado. Usa JPG, PNG, GIF o WebP' }, { status: 400 })
    }

    // Verificar tamaño (base64 es ~33% mas grande que binario)
    const estimatedSize = (image.base64.length * 3) / 4
    if (estimatedSize > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'La imagen es muy grande. Maximo 10MB' }, { status: 400 })
    }

    imageData = {
      base64: image.base64,
      mimeType: image.mimeType
    }
  }

  try {
    const resultado = await chatLegal(pregunta, session.user.id, provider, imageData)
    return NextResponse.json({
      respuesta: resultado.respuesta,
      provider: resultado.provider,
      hadImage: !!imageData
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

  // Devolver tambien los proveedores disponibles y los que soportan vision
  const providers = getAvailableProviders()
  const visionProviders = getVisionProviders()

  return NextResponse.json({ historial, providers, visionProviders })
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
