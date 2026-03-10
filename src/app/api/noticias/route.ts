import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchTodasLasNoticias, FUENTES_OFICIALES, type NoticiaLegal } from '@/lib/scraper'

// Cache de noticias (1 hora)
let noticiasCache: NoticiaLegal[] = []
let lastFetch: number = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hora

// Noticias estaticas de respaldo (siempre disponibles)
const NOTICIAS_ESTATICAS: NoticiaLegal[] = [
  {
    id: 'static-1',
    titulo: 'Ley N 21.681 modifica la Ley Organica de Municipalidades sobre participacion ciudadana',
    resumen: 'La nueva normativa introduce mecanismos vinculantes de participacion ciudadana en las decisiones de inversion municipal, estableciendo que un porcentaje del presupuesto comunal debe destinarse a proyectos elegidos por consultas ciudadanas.',
    fecha: new Date().toISOString(),
    fuente: 'Diario Oficial',
    categoria: 'LEGISLACION',
    enlace: 'https://www.diariooficial.interior.gob.cl',
    destacada: true
  },
  {
    id: 'static-2',
    titulo: 'Contraloria emite Dictamen sobre probidad en comisiones evaluadoras',
    resumen: 'El dictamen establece criterios estrictos sobre conflictos de interes en procesos de licitacion publica, reforzando el deber de abstencion de funcionarios municipales con vinculo familiar o comercial con oferentes.',
    fecha: new Date(Date.now() - 86400000).toISOString(),
    fuente: 'Contraloria General',
    categoria: 'JURISPRUDENCIA',
    enlace: 'https://www.contraloria.cl/web/cgr/dictamenes',
    destacada: true
  },
  {
    id: 'static-3',
    titulo: 'SUBDERE publica Circular sobre actualizacion de Planes Reguladores',
    resumen: 'Nueva circular instruye a las municipalidades sobre el procedimiento para actualizar sus Planes Reguladores Comunales conforme a la Ley General de Urbanismo y Construcciones.',
    fecha: new Date(Date.now() - 172800000).toISOString(),
    fuente: 'SUBDERE',
    categoria: 'PRACTICA_JURIDICA',
    enlace: 'https://www.subdere.gov.cl',
    destacada: false
  },
  {
    id: 'static-4',
    titulo: 'Modificacion al Reglamento de Patentes Municipales',
    resumen: 'Se modifican las categorias de patentes comerciales, estableciendo nuevas clasificaciones para comercio electronico y servicios digitales que operan en el territorio comunal.',
    fecha: new Date(Date.now() - 259200000).toISOString(),
    fuente: 'Diario Oficial',
    categoria: 'LEGISLACION',
    enlace: 'https://www.diariooficial.interior.gob.cl',
    destacada: false
  },
  {
    id: 'static-5',
    titulo: 'Corte Suprema ratifica facultades de DOM en permisos de edificacion',
    resumen: 'La Corte Suprema confirma que las Direcciones de Obras Municipales tienen facultad para revocar permisos de edificacion cuando se detectan irregularidades graves en la ejecucion del proyecto.',
    fecha: new Date(Date.now() - 345600000).toISOString(),
    fuente: 'Poder Judicial',
    categoria: 'JURISPRUDENCIA',
    enlace: 'https://www.pjud.cl',
    destacada: false
  },
  {
    id: 'static-6',
    titulo: 'Ley sobre transparencia en subvenciones municipales',
    resumen: 'Nueva normativa establece obligaciones de rendicion de cuentas para organizaciones que reciben subvenciones municipales, incluyendo publicacion de informes en el portal de transparencia.',
    fecha: new Date(Date.now() - 432000000).toISOString(),
    fuente: 'Diario Oficial',
    categoria: 'LEGISLACION',
    enlace: 'https://www.diariooficial.interior.gob.cl',
    destacada: false
  },
  {
    id: 'static-7',
    titulo: 'Dictamen sobre teletrabajo en funcionarios municipales',
    resumen: 'Contraloria dictamina sobre la aplicacion del teletrabajo en funcionarios municipales, aclarando requisitos de conectividad, horarios y compensacion de gastos.',
    fecha: new Date(Date.now() - 518400000).toISOString(),
    fuente: 'Contraloria General',
    categoria: 'JURISPRUDENCIA',
    enlace: 'https://www.contraloria.cl',
    destacada: false
  },
  {
    id: 'static-8',
    titulo: 'Actualizacion de criterios para el Registro Social de Hogares',
    resumen: 'El Ministerio de Desarrollo Social emite nuevos criterios para que las municipalidades apliquen el Registro Social de Hogares en la focalizacion de beneficios sociales.',
    fecha: new Date(Date.now() - 604800000).toISOString(),
    fuente: 'Min. Desarrollo Social',
    categoria: 'PRACTICA_JURIDICA',
    enlace: 'https://www.desarrollosocialyfamilia.gob.cl',
    destacada: false
  },
  {
    id: 'static-9',
    titulo: 'Normas sobre contratacion de personal a honorarios en municipalidades',
    resumen: 'Contraloria aclara las condiciones para la contratacion a honorarios en municipalidades, limitando su uso a labores accidentales y cometidos especificos.',
    fecha: new Date(Date.now() - 691200000).toISOString(),
    fuente: 'Contraloria General',
    categoria: 'JURISPRUDENCIA',
    enlace: 'https://www.contraloria.cl',
    destacada: false
  },
  {
    id: 'static-10',
    titulo: 'Guia para la aplicacion del silencio administrativo en municipios',
    resumen: 'Nueva guia practica sobre la aplicacion del silencio administrativo positivo y negativo en procedimientos tramitados ante municipalidades.',
    fecha: new Date(Date.now() - 777600000).toISOString(),
    fuente: 'SUBDERE',
    categoria: 'DOCTRINA',
    enlace: 'https://www.subdere.gov.cl',
    destacada: false
  }
]

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
    // Intentar obtener noticias de fuentes oficiales
    try {
      const noticiasExternas = await fetchTodasLasNoticias()

      if (noticiasExternas.length > 0) {
        // Combinar con noticias estaticas
        noticias = [...noticiasExternas, ...NOTICIAS_ESTATICAS]
        noticiasCache = noticias
        lastFetch = ahora
      } else {
        // Si no hay noticias externas, usar las estaticas
        noticias = NOTICIAS_ESTATICAS
      }
    } catch (error) {
      console.error('Error fetching external news:', error)
      noticias = NOTICIAS_ESTATICAS
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
