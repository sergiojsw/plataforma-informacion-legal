'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AdvancedFilters } from '@/components/AdvancedFilters'

interface FilterState {
  categorias: string[]
  fechaDesde: string
  fechaHasta: string
  ordenarPor: 'fecha_desc' | 'fecha_asc' | 'titulo_asc' | 'titulo_desc'
}

export default function BibliotecaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [documentos, setDocumentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState<FilterState>({
    categorias: [],
    fechaDesde: '',
    fechaHasta: '',
    ordenarPor: 'fecha_desc'
  })
  const [stats, setStats] = useState({
    legislacion: 0,
    jurisprudencia: 0,
    doctrina: 0,
    practica: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDocumentos()
    }
  }, [session, pagination.page, filters])

  const fetchDocumentos = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: '10',
      ordenarPor: filters.ordenarPor
    })

    if (filters.categorias.length > 0) {
      params.set('categorias', filters.categorias.join(','))
    }
    if (filters.fechaDesde) {
      params.set('fechaDesde', filters.fechaDesde)
    }
    if (filters.fechaHasta) {
      params.set('fechaHasta', filters.fechaHasta)
    }

    const res = await fetch(`/api/documentos?${params}`)
    const data = await res.json()

    setDocumentos(data.documentos || [])
    setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
    if (data.stats) {
      setStats(data.stats)
    }
    setLoading(false)
  }

  const handleFiltersApply = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPagination(p => ({ ...p, page: 1 }))
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Biblioteca Juridica</h1>
          <p className="text-gray-600 mt-1">
            {pagination.total} documentos disponibles
          </p>
        </div>
        <AdvancedFilters onApply={handleFiltersApply} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Legislacion"
          count={stats.legislacion}
          color="blue"
          active={filters.categorias.includes('LEGISLACION')}
          onClick={() => handleFiltersApply({
            ...filters,
            categorias: filters.categorias.includes('LEGISLACION')
              ? filters.categorias.filter(c => c !== 'LEGISLACION')
              : [...filters.categorias, 'LEGISLACION']
          })}
        />
        <StatCard
          label="Jurisprudencia"
          count={stats.jurisprudencia}
          color="green"
          active={filters.categorias.includes('JURISPRUDENCIA')}
          onClick={() => handleFiltersApply({
            ...filters,
            categorias: filters.categorias.includes('JURISPRUDENCIA')
              ? filters.categorias.filter(c => c !== 'JURISPRUDENCIA')
              : [...filters.categorias, 'JURISPRUDENCIA']
          })}
        />
        <StatCard
          label="Doctrina"
          count={stats.doctrina}
          color="purple"
          active={filters.categorias.includes('DOCTRINA')}
          onClick={() => handleFiltersApply({
            ...filters,
            categorias: filters.categorias.includes('DOCTRINA')
              ? filters.categorias.filter(c => c !== 'DOCTRINA')
              : [...filters.categorias, 'DOCTRINA']
          })}
        />
        <StatCard
          label="Practica Juridica"
          count={stats.practica}
          color="orange"
          active={filters.categorias.includes('PRACTICA_JURIDICA')}
          onClick={() => handleFiltersApply({
            ...filters,
            categorias: filters.categorias.includes('PRACTICA_JURIDICA')
              ? filters.categorias.filter(c => c !== 'PRACTICA_JURIDICA')
              : [...filters.categorias, 'PRACTICA_JURIDICA']
          })}
        />
      </div>

      {/* Active Filters Tags */}
      {(filters.categorias.length > 0 || filters.fechaDesde || filters.fechaHasta) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Filtros activos:</span>
          {filters.categorias.map(cat => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {cat.replace('_', ' ')}
              <button
                onClick={() => handleFiltersApply({
                  ...filters,
                  categorias: filters.categorias.filter(c => c !== cat)
                })}
                className="hover:text-blue-600"
              >
                x
              </button>
            </span>
          ))}
          {filters.fechaDesde && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
              Desde: {filters.fechaDesde}
              <button
                onClick={() => handleFiltersApply({ ...filters, fechaDesde: '' })}
                className="hover:text-gray-600"
              >
                x
              </button>
            </span>
          )}
          {filters.fechaHasta && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
              Hasta: {filters.fechaHasta}
              <button
                onClick={() => handleFiltersApply({ ...filters, fechaHasta: '' })}
                className="hover:text-gray-600"
              >
                x
              </button>
            </span>
          )}
          <button
            onClick={() => handleFiltersApply({
              categorias: [],
              fechaDesde: '',
              fechaHasta: '',
              ordenarPor: 'fecha_desc'
            })}
            className="text-sm text-red-600 hover:underline"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* Document List */}
      {loading ? (
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : documentos.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay documentos que coincidan con los filtros</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => handleFiltersApply({
                categorias: [],
                fechaDesde: '',
                fechaHasta: '',
                ordenarPor: 'fecha_desc'
              })}
            >
              Limpiar filtros
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {documentos.map(doc => (
            <DocumentoCard key={doc.id} documento={doc} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
          >
            Anterior
          </Button>
          <span className="px-4 py-2 text-gray-600">
            Pagina {pagination.page} de {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  count,
  color,
  active,
  onClick
}: {
  label: string
  count: number
  color: 'blue' | 'green' | 'purple' | 'orange'
  active: boolean
  onClick: () => void
}) {
  const colorClasses = {
    blue: active ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100',
    green: active ? 'bg-green-600 text-white' : 'bg-green-50 text-green-800 hover:bg-green-100',
    purple: active ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-800 hover:bg-purple-100',
    orange: active ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
  }

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl transition-colors cursor-pointer ${colorClasses[color]}`}
    >
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-sm">{label}</div>
    </button>
  )
}

function DocumentoCard({ documento }: { documento: any }) {
  const [expanded, setExpanded] = useState(false)

  const categoriaBadge: Record<string, string> = {
    LEGISLACION: 'bg-blue-100 text-blue-800',
    JURISPRUDENCIA: 'bg-green-100 text-green-800',
    DOCTRINA: 'bg-purple-100 text-purple-800',
    PRACTICA_JURIDICA: 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{documento.titulo}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoriaBadge[documento.categoria]}`}>
          {documento.categoria.replace('_', ' ')}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{documento.resumen}</p>

      {expanded && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">{documento.contenido}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Ver menos' : 'Ver contenido completo'}
        </Button>

        {documento.enlace && (
          <a
            href={documento.enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
          >
            Ver fuente externa
          </a>
        )}
      </div>

      <p className="text-gray-400 text-sm mt-4">
        Actualizado: {new Date(documento.updatedAt).toLocaleDateString('es-CL')}
      </p>
    </div>
  )
}
