'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { AdvancedFilters } from '@/components/AdvancedFilters'

interface FilterState {
  categorias: string[]
  fechaDesde: string
  fechaHasta: string
  ordenarPor: 'fecha_desc' | 'fecha_asc' | 'titulo_asc' | 'titulo_desc'
}

export default function BuscadorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>({
    categorias: [],
    fechaDesde: '',
    fechaHasta: '',
    ordenarPor: 'fecha_desc'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('legalRecentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('legalRecentSearches', JSON.stringify(updated))
  }

  const buscar = async (page = 1, searchTerm?: string) => {
    const termToBusc = searchTerm || query
    if (termToBusc.length < 2) return

    setLoading(true)
    setSearched(true)
    saveSearch(termToBusc)

    const params = new URLSearchParams({
      q: termToBusc,
      page: page.toString(),
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

    const res = await fetch(`/api/busqueda?${params}`)
    const data = await res.json()

    setResultados(data.documentos || [])
    setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    buscar(1)
  }

  const handleFiltersApply = (newFilters: FilterState) => {
    setFilters(newFilters)
    if (searched) {
      buscar(1)
    }
  }

  const handleRecentSearch = (term: string) => {
    setQuery(term)
    buscar(1, term)
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Buscador Juridico</h1>
        <p className="text-gray-600">
          Busca en nuestra base de documentos legales con filtros avanzados
        </p>
      </div>

      {/* Search Form */}
      <Card className="max-w-4xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Escribe tu busqueda..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" loading={loading}>
              Buscar
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <AdvancedFilters onApply={handleFiltersApply} />

            {/* Quick Category Filters */}
            <div className="flex flex-wrap gap-2">
              {['LEGISLACION', 'JURISPRUDENCIA', 'DOCTRINA', 'PRACTICA_JURIDICA'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    const newCategorias = filters.categorias.includes(cat)
                      ? filters.categorias.filter(c => c !== cat)
                      : [...filters.categorias, cat]
                    handleFiltersApply({ ...filters, categorias: newCategorias })
                  }}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.categorias.includes(cat)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </form>
      </Card>

      {/* Recent Searches */}
      {!searched && recentSearches.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Busquedas recientes</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, i) => (
              <button
                key={i}
                onClick={() => handleRecentSearch(term)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {!searched && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Sugerencias de busqueda</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <SuggestionCard
              title="Ley de Municipalidades"
              description="Buscar normativa sobre gobiernos locales"
              onClick={() => handleRecentSearch('Ley Organica de Municipalidades')}
            />
            <SuggestionCard
              title="Probidad Administrativa"
              description="Normativa sobre etica publica"
              onClick={() => handleRecentSearch('probidad administrativa')}
            />
            <SuggestionCard
              title="Transparencia"
              description="Acceso a informacion publica"
              onClick={() => handleRecentSearch('Ley de Transparencia')}
            />
            <SuggestionCard
              title="Compras Publicas"
              description="Regulacion de contrataciones"
              onClick={() => handleRecentSearch('Ley de Compras Publicas')}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {searched && (
        <div className="max-w-4xl mx-auto">
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
          ) : resultados.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg">
                  No se encontraron resultados para "{query}"
                </p>
                <p className="text-gray-400 mt-2">
                  Intenta con otras palabras clave o ajusta los filtros
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearched(false)
                    setQuery('')
                    setFilters({
                      categorias: [],
                      fechaDesde: '',
                      fechaHasta: '',
                      ordenarPor: 'fecha_desc'
                    })
                  }}
                >
                  Nueva busqueda
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  {pagination.total} resultado{pagination.total !== 1 ? 's' : ''} para "{query}"
                </p>
                <button
                  onClick={() => {
                    setSearched(false)
                    setQuery('')
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Nueva busqueda
                </button>
              </div>

              <div className="space-y-4">
                {resultados.map(doc => (
                  <ResultadoCard key={doc.id} documento={doc} query={query} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => buscar(pagination.page - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="px-4 py-2 text-gray-600">
                    Pagina {pagination.page} de {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => buscar(pagination.page + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function SuggestionCard({
  title,
  description,
  onClick
}: {
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
    >
      <h4 className="font-medium text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </button>
  )
}

function ResultadoCard({ documento, query }: { documento: any; query: string }) {
  const [expanded, setExpanded] = useState(false)

  const categoriaBadge: Record<string, string> = {
    LEGISLACION: 'bg-blue-100 text-blue-800',
    JURISPRUDENCIA: 'bg-green-100 text-green-800',
    DOCTRINA: 'bg-purple-100 text-purple-800',
    PRACTICA_JURIDICA: 'bg-orange-100 text-orange-800'
  }

  // Highlight matches
  const highlightText = (text: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : part
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {highlightText(documento.titulo)}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoriaBadge[documento.categoria]}`}>
          {documento.categoria.replace('_', ' ')}
        </span>
      </div>

      <p className="text-gray-600 text-sm">
        {highlightText(documento.resumen)}
      </p>

      {expanded && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 whitespace-pre-wrap text-sm">
            {highlightText(documento.contenido)}
          </p>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <span className="text-gray-400 text-xs">
          {new Date(documento.createdAt).toLocaleDateString('es-CL')}
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:underline text-sm"
          >
            {expanded ? 'Ver menos' : 'Ver mas'}
          </button>
          {documento.enlace && (
            <a
              href={documento.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Fuente externa
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
