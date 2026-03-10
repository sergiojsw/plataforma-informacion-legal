import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Verificar token de seguridad para cron jobs de Vercel
function verificarAutorizacion(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true
  }
  // En desarrollo, permitir sin token
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  return false
}

interface NoticiaRSS {
  titulo: string
  resumen: string
  enlace: string
  fecha: string
  fuente: string
  categoria: string
}

// Parsear RSS de BCN
async function fetchBCNRSS(): Promise<NoticiaRSS[]> {
  try {
    const res = await fetch('https://www.bcn.cl/leychile/rss', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LegalIA/1.0)' },
      cache: 'no-store'
    })

    if (!res.ok) return []

    const text = await res.text()
    const noticias: NoticiaRSS[] = []
    const items = text.match(/<item>([\s\S]*?)<\/item>/g) || []

    for (const item of items.slice(0, 10)) {
      const titulo = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.replace(/<[^>]*>/g, '').trim() || ''
      const enlace = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
      const descripcion = item.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/)?.[1]?.replace(/<[^>]*>/g, '').trim() || ''
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''

      if (titulo) {
        noticias.push({
          titulo,
          resumen: descripcion.substring(0, 500),
          enlace,
          fecha: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          fuente: 'Biblioteca del Congreso Nacional',
          categoria: 'LEGISLACION'
        })
      }
    }

    return noticias
  } catch (error) {
    console.error('Error fetching BCN RSS:', error)
    return []
  }
}

// Obtener noticias del Diario Oficial (scraping basico de titulares)
async function fetchDiarioOficial(): Promise<NoticiaRSS[]> {
  try {
    const res = await fetch('https://www.diariooficial.interior.gob.cl/edicionelectronica/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LegalIA/1.0)' },
      cache: 'no-store'
    })

    if (!res.ok) return []

    // El Diario Oficial no tiene RSS, devolver noticia generica de actualizacion
    return [{
      titulo: `Edicion Electronica del Diario Oficial - ${new Date().toLocaleDateString('es-CL')}`,
      resumen: 'Consulte las publicaciones oficiales del dia en el Diario Oficial de la Republica de Chile. Incluye leyes, decretos, resoluciones y otros actos administrativos.',
      enlace: 'https://www.diariooficial.interior.gob.cl/edicionelectronica/',
      fecha: new Date().toISOString(),
      fuente: 'Diario Oficial',
      categoria: 'LEGISLACION'
    }]
  } catch (error) {
    console.error('Error fetching Diario Oficial:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  if (!verificarAutorizacion(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    // Obtener noticias de multiples fuentes
    const [bcnNoticias, doNoticias] = await Promise.all([
      fetchBCNRSS(),
      fetchDiarioOficial()
    ])

    const todasLasNoticias = [...bcnNoticias, ...doNoticias]

    // Guardar en cache (tabla de noticias si existe, o log)
    console.log(`[CRON] Obtenidas ${todasLasNoticias.length} noticias de fuentes oficiales`)

    // Crear newsletter automatico si hay noticias nuevas
    if (todasLasNoticias.length > 0) {
      const contenidoHTML = todasLasNoticias.map(n => `
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 8px 0; color: #1e40af;">
            <a href="${n.enlace}" style="color: #1e40af; text-decoration: none;">${n.titulo}</a>
          </h3>
          <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px;">${n.resumen}</p>
          <span style="color: #9ca3af; font-size: 12px;">${n.fuente} - ${new Date(n.fecha).toLocaleDateString('es-CL')}</span>
        </div>
      `).join('')

      // Guardar como borrador de newsletter
      await prisma.newsletter.create({
        data: {
          tipo: 'DIARIO',
          asunto: `Actualizaciones Legales - ${new Date().toLocaleDateString('es-CL')}`,
          contenido: contenidoHTML,
          enviadoAt: null // Borrador, no enviado aun
        }
      })
    }

    return NextResponse.json({
      success: true,
      noticiasObtenidas: todasLasNoticias.length,
      fuentes: ['BCN', 'Diario Oficial'],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[CRON] Error actualizando noticias:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
