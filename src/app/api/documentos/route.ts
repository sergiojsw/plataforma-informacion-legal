import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const categorias = searchParams.get('categorias')
  const fechaDesde = searchParams.get('fechaDesde')
  const fechaHasta = searchParams.get('fechaHasta')
  const ordenarPor = searchParams.get('ordenarPor') || 'fecha_desc'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  // Build where clause
  const where: Prisma.DocumentoWhereInput = {
    activo: true
  }

  // Support single categoria (backwards compatible) or multiple categorias
  if (categorias) {
    const catArray = categorias.split(',').filter(Boolean)
    if (catArray.length > 0) {
      where.categoria = { in: catArray as any[] }
    }
  } else if (categoria) {
    where.categoria = categoria as any
  }

  // Date range filters
  if (fechaDesde || fechaHasta) {
    where.createdAt = {}
    if (fechaDesde) {
      where.createdAt.gte = new Date(fechaDesde)
    }
    if (fechaHasta) {
      const endDate = new Date(fechaHasta)
      endDate.setHours(23, 59, 59, 999)
      where.createdAt.lte = endDate
    }
  }

  // Build orderBy
  let orderBy: Prisma.DocumentoOrderByWithRelationInput = { createdAt: 'desc' }
  switch (ordenarPor) {
    case 'fecha_asc':
      orderBy = { createdAt: 'asc' }
      break
    case 'titulo_asc':
      orderBy = { titulo: 'asc' }
      break
    case 'titulo_desc':
      orderBy = { titulo: 'desc' }
      break
  }

  // Fetch documents and stats in parallel
  const [documentos, total, statsRaw] = await Promise.all([
    prisma.documento.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy
    }),
    prisma.documento.count({ where }),
    prisma.documento.groupBy({
      by: ['categoria'],
      where: { activo: true },
      _count: { id: true }
    })
  ])

  // Process stats
  const stats = {
    legislacion: 0,
    jurisprudencia: 0,
    doctrina: 0,
    practica: 0
  }
  statsRaw.forEach(s => {
    switch (s.categoria) {
      case 'LEGISLACION':
        stats.legislacion = s._count.id
        break
      case 'JURISPRUDENCIA':
        stats.jurisprudencia = s._count.id
        break
      case 'DOCTRINA':
        stats.doctrina = s._count.id
        break
      case 'PRACTICA_JURIDICA':
        stats.practica = s._count.id
        break
    }
  })

  return NextResponse.json({
    documentos,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    stats
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
