import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchTodasLasNoticias, FUENTES_OFICIALES, type NoticiaLegal } from '@/lib/scraper'

// Cache de noticias (1 hora)
let noticiasCache: NoticiaLegal[] = []
let lastFetch: number = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hora

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let noticias: NoticiaLegal[] = []

  // Verificar cache
  const ahora = Date.now()
  if (noticiasCache.length > 0 && (ahora - lastFetch) < CACHE_DURATION) {
    noticias = noticiasCache
  } else {
    // Obtener noticias de fuentes oficiales (BCN RSS + referencias a sitios oficiales)
    try {
      noticias = await fetchTodasLasNoticias()
      if (noticias.length > 0) {
        noticiasCache = noticias
        lastFetch = ahora
      }
    } catch (error) {
      console.error('Error fetching external news:', error)
      // Si falla, usar cache anterior si existe
      if (noticiasCache.length > 0) {
        noticias = noticiasCache
      }
    }
  }

  // Eliminar duplicados por titulo
  const noticiasUnicas = noticias.filter((noticia, index, self) =>
    index === self.findIndex(n => n.titulo === noticia.titulo)
  )

  // Ordenar por fecha
  noticiasUnicas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return NextResponse.json({
    noticias: noticiasUnicas.slice(0, 20),
    fuentes: FUENTES_OFICIALES,
    ultimaActualizacion: new Date().toISOString(),
    totalNoticias: noticiasUnicas.length,
    fuentesActivas: FUENTES_OFICIALES.length
  })
}
