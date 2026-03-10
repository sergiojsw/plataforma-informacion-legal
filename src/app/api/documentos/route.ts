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
  const categoria = searchParams.get('categoria')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const where = {
    activo: true,
    ...(categoria && { categoria: categoria as any })
  }

  const [documentos, total] = await Promise.all([
    prisma.documento.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.documento.count({ where })
  ])

  return NextResponse.json({
    documentos,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { titulo, categoria, resumen, contenido, enlace } = body

  if (!titulo || !categoria || !resumen || !contenido) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const documento = await prisma.documento.create({
    data: {
      titulo,
      categoria,
      resumen,
      contenido,
      enlace
    }
  })

  return NextResponse.json(documento, { status: 201 })
}
