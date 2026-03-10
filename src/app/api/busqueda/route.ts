import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const categoria = searchParams.get('categoria')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'La búsqueda debe tener al menos 2 caracteres' }, { status: 400 })
  }

  const where = {
    activo: true,
    AND: [
      ...(categoria ? [{ categoria: categoria as any }] : []),
      {
        OR: [
          { titulo: { contains: q, mode: 'insensitive' as const } },
          { resumen: { contains: q, mode: 'insensitive' as const } },
          { contenido: { contains: q, mode: 'insensitive' as const } }
        ]
      }
    ]
  }

  const [documentos, total] = await Promise.all([
    prisma.documento.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        titulo: true,
        categoria: true,
        resumen: true,
        enlace: true,
        createdAt: true
      }
    }),
    prisma.documento.count({ where })
  ])

  return NextResponse.json({
    query: q,
    documentos,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}
