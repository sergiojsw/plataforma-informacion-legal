import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - 7)
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    // Fetch all data in parallel
    const [
      totalUsers,
      adminCount,
      newUsersThisMonth,
      totalDocuments,
      documentsByCategory,
      recentDocuments,
      totalChats,
      chatsToday,
      chatsThisWeek,
      totalNewsletters,
      sentNewsletters
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { rol: 'ADMIN' } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.documento.count({ where: { activo: true } }),
      prisma.documento.groupBy({
        by: ['categoria'],
        where: { activo: true },
        _count: { id: true }
      }),
      prisma.documento.findMany({
        where: { activo: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          titulo: true,
          categoria: true,
          createdAt: true
        }
      }),
      prisma.chatHistory.count(),
      prisma.chatHistory.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.chatHistory.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.newsletter.count(),
      prisma.newsletter.count({ where: { enviadoAt: { not: null } } })
    ])

    // Process categories
    const porCategoria: Record<string, number> = {}
    documentsByCategory.forEach(item => {
      porCategoria[item.categoria] = item._count.id
    })

    return NextResponse.json({
      usuarios: {
        total: totalUsers,
        admins: adminCount,
        usuarios: totalUsers - adminCount,
        nuevosEsteMes: newUsersThisMonth
      },
      documentos: {
        total: totalDocuments,
        porCategoria,
        recientes: recentDocuments
      },
      chat: {
        totalConsultas: totalChats,
        consultasHoy: chatsToday,
        consultasSemana: chatsThisWeek
      },
      newsletters: {
        total: totalNewsletters,
        enviados: sentNewsletters,
        pendientes: totalNewsletters - sentNewsletters
      }
    })
  } catch (error) {
    console.error('Error fetching admin dashboard:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
