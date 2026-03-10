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
  const q = searchParams.get('q') || ''
  const categoria = searchParams.get('categoria')
  const categorias = searchParams.get('categorias')
  const fechaDesde = searchParams.get('fechaDesde')
  const fechaHasta = searchParams.get('fechaHasta')
  const ordenarPor = searchParams.get('ordenarPor') || 'fecha_desc'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'La busqueda debe tener al menos 2 caracteres' }, { status: 400 })
  }

  // Build where clause
  const conditions: Prisma.DocumentoWhereInput[] = [
    { activo: true },
    {
      OR: [
        { titulo: { contains: q, mode: 'insensitive' as const } },
        { resumen: { contains: q, mode: 'insensitive' as const } },
        { contenido: { contains: q, mode: 'insensitive' as const } }
      ]
    }
  ]

  // Category filter (single or multiple)
  if (categorias) {
    const catArray = categorias.split(',').filter(Boolean)
    if (catArray.length > 0) {
      conditions.push({ categoria: { in: catArray as any[] } })
    }
  } else if (categoria) {
    conditions.push({ categoria: categoria as any })
  }

  // Date range filters
  if (fechaDesde || fechaHasta) {
    const dateCondition: Prisma.DateTimeFilter = {}
    if (fechaDesde) {
      dateCondition.gte = new Date(fechaDesde)
    }
    if (fechaHasta) {
      const endDate = new Date(fechaHasta)
      endDate.setHours(23, 59, 59, 999)
      dateCondition.lte = endDate
    }
    conditions.push({ createdAt: dateCondition })
  }

  const where: Prisma.DocumentoWhereInput = {
    AND: conditions
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

  const [documentos, total] = await Promise.all([
    prisma.documento.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      select: {
        id: true,
        titulo: true,
        categoria: true,
        resumen: true,
        contenido: true,
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
