/**
 * Servicio de Scraping para Fuentes Juridicas Oficiales
 * Obtiene noticias y actualizaciones de BCN, Diario Oficial, CGR, etc.
 */

export interface NoticiaLegal {
  id: string
  titulo: string
  resumen: string
  contenido?: string
  fecha: string
  fuente: string
  categoria: 'LEGISLACION' | 'JURISPRUDENCIA' | 'DOCTRINA' | 'PRACTICA_JURIDICA'
  enlace: string
  destacada: boolean
}

// =====================================================
// BIBLIOTECA DEL CONGRESO NACIONAL (BCN)
// =====================================================

export async function fetchBCNNoticias(): Promise<NoticiaLegal[]> {
  const noticias: NoticiaLegal[] = []

  try {
    // RSS real de ultimas leyes publicadas (via FeedBurner)
    const res = await fetch('http://feeds.feedburner.com/bcn/ulp?format=xml', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LegalIA/1.0)' },
      next: { revalidate: 3600 }
    })

    if (!res.ok) return noticias

    const text = await res.text()
    const items = text.match(/<item>([\s\S]*?)<\/item>/g) || []

    items.slice(0, 15).forEach((item, index) => {
      const titulo = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.replace(/<[^>]*>/g, '').trim() || ''
      const enlace = item.match(/<link>(.*?)<\/link>/)?.[1]?.replace(/&amp;/g, '&') || ''
      const descripcion = item.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/)?.[1]?.replace(/<[^>]*>/g, '').trim() || ''
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''

      if (titulo) {
        noticias.push({
          id: `bcn-${Date.now()}-${index}`,
          titulo: `${titulo} - ${descripcion}`.substring(0, 200),
          resumen: descripcion,
          fecha: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          fuente: 'Biblioteca del Congreso Nacional',
          categoria: 'LEGISLACION',
          enlace,
          destacada: index < 3
        })
      }
    })
  } catch (error) {
    console.error('Error fetching BCN RSS:', error)
  }

  return noticias
}

// =====================================================
// DIARIO OFICIAL
// =====================================================

export async function fetchDiarioOficial(): Promise<NoticiaLegal[]> {
  const noticias: NoticiaLegal[] = []
  const hoy = new Date()

  try {
    // El Diario Oficial no tiene RSS, creamos una noticia de la edicion del dia
    noticias.push({
      id: `do-${hoy.toISOString().split('T')[0]}`,
      titulo: `Edicion Electronica del Diario Oficial - ${hoy.toLocaleDateString('es-CL')}`,
      resumen: 'Publicaciones oficiales del dia incluyendo leyes, decretos, resoluciones, reglamentos y otros actos administrativos de la Republica de Chile.',
      fecha: hoy.toISOString(),
      fuente: 'Diario Oficial',
      categoria: 'LEGISLACION',
      enlace: 'https://www.diariooficial.interior.gob.cl/edicionelectronica/',
      destacada: true
    })

    // Secciones tipicas del Diario Oficial
    const secciones = [
      { nombre: 'Leyes y Decretos con Fuerza de Ley', categoria: 'LEGISLACION' as const },
      { nombre: 'Decretos Supremos', categoria: 'LEGISLACION' as const },
      { nombre: 'Resoluciones', categoria: 'LEGISLACION' as const },
      { nombre: 'Avisos Judiciales', categoria: 'JURISPRUDENCIA' as const }
    ]

    secciones.forEach((seccion, index) => {
      noticias.push({
        id: `do-seccion-${index}-${Date.now()}`,
        titulo: `${seccion.nombre} - ${hoy.toLocaleDateString('es-CL')}`,
        resumen: `Consulte las publicaciones de ${seccion.nombre.toLowerCase()} en la edicion electronica del Diario Oficial.`,
        fecha: hoy.toISOString(),
        fuente: 'Diario Oficial',
        categoria: seccion.categoria,
        enlace: 'https://www.diariooficial.interior.gob.cl/edicionelectronica/',
        destacada: false
      })
    })
  } catch (error) {
    console.error('Error fetching Diario Oficial:', error)
  }

  return noticias
}

// =====================================================
// CONTRALORIA GENERAL DE LA REPUBLICA
// =====================================================

export async function fetchContraloria(): Promise<NoticiaLegal[]> {
  const noticias: NoticiaLegal[] = []
  const hoy = new Date()

  try {
    // La CGR no tiene RSS publico, creamos referencias a secciones importantes
    const secciones = [
      {
        titulo: 'Buscador de Jurisprudencia - Contraloria General',
        resumen: 'Consulte los dictamenes emitidos por la Contraloria General de la Republica sobre materias de administracion publica, municipal y probidad.',
        enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
      },
      {
        titulo: 'Dictamenes y Pronunciamientos Juridicos',
        resumen: 'Dictamenes sobre probidad, licitaciones, contratacion publica y funcionarios municipales.',
        enlace: 'https://www.contraloria.cl/web/cgr/dictamenes-y-pronunciamientos-juridicos'
      }
    ]

    secciones.forEach((seccion, index) => {
      noticias.push({
        id: `cgr-${index}-${Date.now()}`,
        titulo: seccion.titulo,
        resumen: seccion.resumen,
        fecha: hoy.toISOString(),
        fuente: 'Contraloria General',
        categoria: 'JURISPRUDENCIA',
        enlace: seccion.enlace,
        destacada: index === 0
      })
    })
  } catch (error) {
    console.error('Error fetching CGR:', error)
  }

  return noticias
}

// =====================================================
// SUBDERE (SUBSECRETARIA DE DESARROLLO REGIONAL)
// =====================================================

export async function fetchSUBDERE(): Promise<NoticiaLegal[]> {
  const noticias: NoticiaLegal[] = []
  const hoy = new Date()

  try {
    const temas = [
      {
        titulo: 'Circulares SUBDERE para Municipalidades',
        resumen: 'Instrucciones y orientaciones de la Subsecretaria de Desarrollo Regional para la gestion municipal.',
        enlace: 'https://www.subdere.gov.cl/documentacion/circulares'
      },
      {
        titulo: 'Programas de Fortalecimiento Municipal',
        resumen: 'Fondos y programas disponibles para municipalidades: PMU, FRIL, FNDR y otros instrumentos de financiamiento.',
        enlace: 'https://www.subdere.gov.cl/programas'
      },
      {
        titulo: 'Guias Tecnicas para Municipios',
        resumen: 'Documentos de apoyo tecnico para la gestion municipal en materias de planificacion, finanzas y participacion ciudadana.',
        enlace: 'https://www.subdere.gov.cl/documentacion'
      }
    ]

    temas.forEach((tema, index) => {
      noticias.push({
        id: `subdere-${index}-${Date.now()}`,
        titulo: tema.titulo,
        resumen: tema.resumen,
        fecha: hoy.toISOString(),
        fuente: 'SUBDERE',
        categoria: 'PRACTICA_JURIDICA',
        enlace: tema.enlace,
        destacada: false
      })
    })
  } catch (error) {
    console.error('Error fetching SUBDERE:', error)
  }

  return noticias
}

// =====================================================
// PODER JUDICIAL
// =====================================================

export async function fetchPoderJudicial(): Promise<NoticiaLegal[]> {
  const noticias: NoticiaLegal[] = []
  const hoy = new Date()

  try {
    const recursos = [
      {
        titulo: 'Jurisprudencia de la Corte Suprema',
        resumen: 'Sentencias relevantes de la Corte Suprema en materias de derecho publico, recursos de proteccion y nulidad de derecho publico.',
        enlace: 'https://www.pjud.cl/corte-suprema/jurisprudencia'
      },
      {
        titulo: 'Buscador de Causas',
        resumen: 'Consulte el estado de causas judiciales en todos los tribunales del pais.',
        enlace: 'https://oficinajudicialvirtual.pjud.cl/consultaUnificada/consultaUnificada.php'
      }
    ]

    recursos.forEach((recurso, index) => {
      noticias.push({
        id: `pjud-${index}-${Date.now()}`,
        titulo: recurso.titulo,
        resumen: recurso.resumen,
        fecha: hoy.toISOString(),
        fuente: 'Poder Judicial',
        categoria: 'JURISPRUDENCIA',
        enlace: recurso.enlace,
        destacada: false
      })
    })
  } catch (error) {
    console.error('Error fetching Poder Judicial:', error)
  }

  return noticias
}

// =====================================================
// FUNCION PRINCIPAL: OBTENER TODAS LAS NOTICIAS
// =====================================================

export async function fetchTodasLasNoticias(): Promise<NoticiaLegal[]> {
  const [bcn, diarioOficial, cgr, subdere, pjud] = await Promise.all([
    fetchBCNNoticias(),
    fetchDiarioOficial(),
    fetchContraloria(),
    fetchSUBDERE(),
    fetchPoderJudicial()
  ])

  const todasLasNoticias = [...bcn, ...diarioOficial, ...cgr, ...subdere, ...pjud]

  // Ordenar por fecha (mas recientes primero)
  todasLasNoticias.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return todasLasNoticias
}

// =====================================================
// FUENTES OFICIALES (para mostrar en UI)
// =====================================================

export const FUENTES_OFICIALES = [
  {
    nombre: 'Biblioteca del Congreso Nacional',
    url: 'https://www.bcn.cl/leychile',
    descripcion: 'Legislacion chilena actualizada',
    icono: '📚'
  },
  {
    nombre: 'Diario Oficial',
    url: 'https://www.diariooficial.interior.gob.cl',
    descripcion: 'Publicaciones oficiales del Estado',
    icono: '📰'
  },
  {
    nombre: 'Contraloria General',
    url: 'https://www.contraloria.cl',
    descripcion: 'Dictamenes y jurisprudencia administrativa',
    icono: '⚖️'
  },
  {
    nombre: 'SUBDERE',
    url: 'https://www.subdere.gov.cl',
    descripcion: 'Recursos para municipalidades',
    icono: '🏛️'
  },
  {
    nombre: 'Poder Judicial',
    url: 'https://www.pjud.cl',
    descripcion: 'Jurisprudencia judicial',
    icono: '👨‍⚖️'
  },
  {
    nombre: 'Ministerio de Justicia',
    url: 'https://www.minjusticia.gob.cl',
    descripcion: 'Normativa y proyectos de ley',
    icono: '🏛️'
  }
]
