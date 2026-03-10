import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    // Fetch all data in parallel
    const [
      totalDocumentos,
      chatHistory,
      documentosPorCategoriaRaw
    ] = await Promise.all([
      prisma.documento.count({ where: { activo: true } }),
      prisma.chatHistory.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          pregunta: true,
          createdAt: true
        }
      }),
      prisma.documento.groupBy({
        by: ['categoria'],
        where: { activo: true },
        _count: { id: true }
      })
    ])

    // Count total chat history
    const chatHistoryCount = await prisma.chatHistory.count({
      where: { userId: session.user.id }
    })

    // Process categories
    const documentosPorCategoria: Record<string, number> = {}
    documentosPorCategoriaRaw.forEach(item => {
      documentosPorCategoria[item.categoria] = item._count.id
    })

    return NextResponse.json({
      totalDocumentos,
      chatHistoryCount,
      recentChats: chatHistory,
      documentosPorCategoria
    })
  } catch (error) {
    console.error('Error fetching user dashboard:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
