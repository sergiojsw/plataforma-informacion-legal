'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Noticia {
  id: string
  titulo: string
  resumen: string
  fecha: string
  fuente: string
  categoria: string
  enlace: string
  destacada: boolean
}

interface Fuente {
  nombre: string
  url: string
  descripcion: string
}

export default function BoletinPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [newsletters, setNewsletters] = useState<any[]>([])
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [fuentes, setFuentes] = useState<Fuente[]>([])
  const [tipo, setTipo] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'noticias' | 'boletines'>('noticias')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, tipo])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [newslettersRes, noticiasRes] = await Promise.all([
        fetch(`/api/newsletter?${tipo ? `tipo=${tipo}` : ''}`),
        fetch('/api/noticias')
      ])

      const newslettersData = await newslettersRes.json()
      const noticiasData = await noticiasRes.json()

      setNewsletters(newslettersData.newsletters || [])
      setNoticias(noticiasData.noticias || [])
      setFuentes(noticiasData.fuentes || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const noticiasFiltradas = categoriaFiltro
    ? noticias.filter(n => n.categoria === categoriaFiltro)
    : noticias

  const noticiasDestacadas = noticias.filter(n => n.destacada)

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Boletin Legal</h1>
        <p className="text-gray-600 mt-2">
          Noticias y actualizaciones juridicas para municipalidades
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('noticias')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'noticias'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Noticias Legales
        </button>
        <button
          onClick={() => setActiveTab('boletines')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'boletines'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Boletines ({newsletters.length})
        </button>
      </div>

      {activeTab === 'noticias' ? (
        <>
          {/* Noticias Destacadas */}
          {noticiasDestacadas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Noticias Destacadas</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {noticiasDestacadas.map(noticia => (
                  <NoticiaDestacadaCard key={noticia.id} noticia={noticia} />
                ))}
              </div>
            </div>
          )}

          {/* Filtros de categoria */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-gray-600 py-2">Filtrar por:</span>
            {['', 'LEGISLACION', 'JURISPRUDENCIA', 'DOCTRINA', 'PRACTICA_JURIDICA'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoriaFiltro === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === '' ? 'Todas' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Lista de Noticias */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {noticiasFiltradas.map(noticia => (
                <NoticiaCard key={noticia.id} noticia={noticia} />
              ))}
            </div>
          )}

          {/* Fuentes */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fuentes Oficiales</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fuentes.map((fuente, i) => (
                <a
                  key={i}
                  href={fuente.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <h4 className="font-medium text-gray-800">{fuente.nombre}</h4>
                  <p className="text-sm text-gray-500 mt-1">{fuente.descripcion}</p>
                  <span className="text-blue-600 text-sm mt-2 inline-block">Visitar</span>
                </a>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Filtros de boletines */}
          <div className="flex justify-end gap-2 mb-6">
            <button
              onClick={() => setTipo('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tipo === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTipo('DIARIO')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tipo === 'DIARIO' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Diarios
            </button>
            <button
              onClick={() => setTipo('SEMANAL')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tipo === 'SEMANAL' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semanales
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : newsletters.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📬</div>
                <p className="text-gray-500 text-lg">No hay boletines disponibles</p>
                <p className="text-gray-400 mt-2">
                  Los boletines se envian automaticamente a tu correo
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {newsletters.map(newsletter => (
                <NewsletterCard key={newsletter.id} newsletter={newsletter} />
              ))}
            </div>
          )}

          <Card className="mt-8 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📧</div>
              <div>
                <h3 className="font-semibold text-gray-800">Suscripcion Automatica</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Los boletines se envian automaticamente a tu correo registrado:
                </p>
                <ul className="text-gray-600 text-sm mt-2 list-disc list-inside">
                  <li><strong>Diario:</strong> Novedades legales del dia (lunes a viernes)</li>
                  <li><strong>Semanal:</strong> Resumen de la semana (cada lunes)</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

function NoticiaDestacadaCard({ noticia }: { noticia: Noticia }) {
  const categoriaBadge: Record<string, string> = {
    LEGISLACION: 'bg-blue-100 text-blue-800',
    JURISPRUDENCIA: 'bg-green-100 text-green-800',
    DOCTRINA: 'bg-purple-100 text-purple-800',
    PRACTICA_JURIDICA: 'bg-orange-100 text-orange-800'
  }

  return (
    <a
      href={noticia.enlace}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white hover:from-blue-700 hover:to-blue-900 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${categoriaBadge[noticia.categoria]} bg-opacity-90`}>
          {noticia.categoria.replace('_', ' ')}
        </span>
        <span className="text-blue-200 text-sm">
          {noticia.fuente}
        </span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{noticia.titulo}</h3>
      <p className="text-blue-100 text-sm line-clamp-2">{noticia.resumen}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-blue-200 text-xs">
          {new Date(noticia.fecha).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </span>
        <span className="text-white font-medium text-sm">Leer mas</span>
      </div>
    </a>
  )
}

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  const categoriaBadge: Record<string, string> = {
    LEGISLACION: 'bg-blue-100 text-blue-800',
    JURISPRUDENCIA: 'bg-green-100 text-green-800',
    DOCTRINA: 'bg-purple-100 text-purple-800',
    PRACTICA_JURIDICA: 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoriaBadge[noticia.categoria]}`}>
            {noticia.categoria.replace('_', ' ')}
          </span>
          <span className="text-gray-400 text-sm">{noticia.fuente}</span>
        </div>
        <span className="text-gray-400 text-sm">
          {new Date(noticia.fecha).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'short'
          })}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">{noticia.titulo}</h3>
      <p className="text-gray-600 text-sm">{noticia.resumen}</p>

      <a
        href={noticia.enlace}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium mt-4"
      >
        Leer en fuente original
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  )
}

function NewsletterCard({ newsletter }: { newsletter: any }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <h3 className="text-xl font-semibold text-gray-800">{newsletter.asunto}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            newsletter.tipo === 'DIARIO'
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {newsletter.tipo}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          {new Date(newsletter.createdAt).toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          {newsletter.enviadoAt && (
            <span className="ml-2 text-green-600">Enviado</span>
          )}
        </p>

        <div
          className={`prose prose-sm max-w-none ${!expanded ? 'line-clamp-3' : ''}`}
          dangerouslySetInnerHTML={{ __html: newsletter.contenido }}
        />

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-blue-600 hover:underline text-sm font-medium"
        >
          {expanded ? 'Ver menos' : 'Ver mas'}
        </button>
      </div>
    </div>
  )
}
