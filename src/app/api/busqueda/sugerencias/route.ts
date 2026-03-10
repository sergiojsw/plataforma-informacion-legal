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

  if (!q || q.length < 2) {
    return NextResponse.json({ sugerencias: [] })
  }

  // Search for matching document titles
  const documentos = await prisma.documento.findMany({
    where: {
      activo: true,
      OR: [
        { titulo: { contains: q, mode: 'insensitive' } },
        { resumen: { contains: q, mode: 'insensitive' } }
      ]
    },
    take: 10,
    select: {
      id: true,
      titulo: true,
      categoria: true
    },
    orderBy: { createdAt: 'desc' }
  })

  // Extract unique suggestions from titles
  const sugerencias = documentos.map(doc => ({
    id: doc.id,
    texto: doc.titulo,
    categoria: doc.categoria,
    tipo: 'documento' as const
  }))

  // Add common legal search terms
  const terminosLegales = [
    'Ley Organica Constitucional de Municipalidades',
    'Ley de Transparencia',
    'Ley de Compras Publicas',
    'Probidad Administrativa',
    'Estatuto Administrativo',
    'Codigo del Trabajo',
    'Reglamento Municipal',
    'Ordenanza Municipal',
    'Contraloria General',
    'Procedimiento Administrativo'
  ]

  const termsMaching = terminosLegales
    .filter(term => term.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 3)
    .map(term => ({
      id: null,
      texto: term,
      categoria: null,
      tipo: 'sugerencia' as const
    }))

  return NextResponse.json({
    sugerencias: [...termsMaching, ...sugerencias].slice(0, 8)
  })
}
