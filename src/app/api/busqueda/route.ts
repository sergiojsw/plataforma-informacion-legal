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
  const ordenarPor = searchParams.get('ordenarPor') || 'relevancia'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'La busqueda debe tener al menos 2 caracteres' }, { status: 400 })
  }

  // Parse search terms - split by spaces and filter short words
  const searchTerms = q
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length >= 2)
    .slice(0, 5) // Limit to 5 terms for performance

  // Build OR conditions for each search term
  const searchConditions: Prisma.DocumentoWhereInput[] = searchTerms.map(term => ({
    OR: [
      { titulo: { contains: term, mode: 'insensitive' as const } },
      { resumen: { contains: term, mode: 'insensitive' as const } },
      { contenido: { contains: term, mode: 'insensitive' as const } }
    ]
  }))

  // Build where clause
  const conditions: Prisma.DocumentoWhereInput[] = [
    { activo: true },
    // Match ANY of the search terms (OR logic for broader results)
    { OR: searchConditions.map(c => c) }
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

  // Fetch all matching documents first for relevance sorting
  const allDocuments = await prisma.documento.findMany({
    where,
    select: {
      id: true,
      titulo: true,
      categoria: true,
      resumen: true,
      contenido: true,
      enlace: true,
      createdAt: true
    }
  })

  // Calculate relevance score for each document
  const scoredDocuments = allDocuments.map(doc => {
    let score = 0
    const titleLower = doc.titulo.toLowerCase()
    const resumenLower = doc.resumen.toLowerCase()
    const contenidoLower = doc.contenido.toLowerCase()
    const queryLower = q.toLowerCase()

    // Exact match in title (highest priority)
    if (titleLower.includes(queryLower)) {
      score += 100
    }

    // Exact match in resumen
    if (resumenLower.includes(queryLower)) {
      score += 50
    }

    // Individual term matches
    searchTerms.forEach(term => {
      // Title matches (high weight)
      if (titleLower.includes(term)) {
        score += 30
        // Bonus for term at the start of title
        if (titleLower.startsWith(term)) {
          score += 20
        }
      }

      // Resumen matches (medium weight)
      if (resumenLower.includes(term)) {
        score += 15
      }

      // Content matches (lower weight but still relevant)
      const contentMatches = (contenidoLower.match(new RegExp(term, 'gi')) || []).length
      score += Math.min(contentMatches * 2, 20) // Cap content matches
    })

    // Boost for legal terms that indicate primary sources
    const legalTerms = ['ley', 'decreto', 'articulo', 'codigo', 'constitucion', 'reglamento', 'ordenanza']
    legalTerms.forEach(term => {
      if (titleLower.includes(term) && queryLower.includes(term)) {
        score += 25
      }
    })

    // Slight boost for more recent documents
    const ageInDays = (Date.now() - new Date(doc.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (ageInDays < 30) score += 5
    if (ageInDays < 7) score += 10

    return { ...doc, relevanceScore: score }
  })

  // Sort by relevance or other criteria
  let sortedDocuments = scoredDocuments
  switch (ordenarPor) {
    case 'relevancia':
      sortedDocuments = scoredDocuments.sort((a, b) => b.relevanceScore - a.relevanceScore)
      break
    case 'fecha_desc':
      sortedDocuments = scoredDocuments.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      break
    case 'fecha_asc':
      sortedDocuments = scoredDocuments.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      break
    case 'titulo_asc':
      sortedDocuments = scoredDocuments.sort((a, b) => a.titulo.localeCompare(b.titulo))
      break
    case 'titulo_desc':
      sortedDocuments = scoredDocuments.sort((a, b) => b.titulo.localeCompare(a.titulo))
      break
  }

  // Paginate results
  const total = sortedDocuments.length
  const paginatedDocuments = sortedDocuments.slice((page - 1) * limit, page * limit)

  // Extract snippet with highlighted context
  const documentsWithSnippets = paginatedDocuments.map(doc => {
    // Find best snippet from content
    const contenidoLower = doc.contenido.toLowerCase()
    const queryLower = q.toLowerCase()
    let snippet = doc.resumen

    // Try to find a relevant snippet in content
    const matchIndex = contenidoLower.indexOf(queryLower)
    if (matchIndex !== -1) {
      const start = Math.max(0, matchIndex - 100)
      const end = Math.min(doc.contenido.length, matchIndex + q.length + 200)
      snippet = (start > 0 ? '...' : '') +
        doc.contenido.slice(start, end) +
        (end < doc.contenido.length ? '...' : '')
    }

    return {
      id: doc.id,
      titulo: doc.titulo,
      categoria: doc.categoria,
      resumen: doc.resumen,
      contenido: doc.contenido,
      snippet,
      enlace: doc.enlace,
      createdAt: doc.createdAt,
      relevanceScore: doc.relevanceScore
    }
  })

  // Get related terms for "did you mean" / suggestions
  const relatedCategories = [...new Set(paginatedDocuments.map(d => d.categoria))]

  return NextResponse.json({
    query: q,
    searchTerms,
    documentos: documentsWithSnippets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    metadata: {
      relatedCategories,
      hasMore: page * limit < total
    }
  })
}
