'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AdvancedFilters } from '@/components/AdvancedFilters'

interface FilterState {
  categorias: string[]
  fechaDesde: string
  fechaHasta: string
  ordenarPor: 'fecha_desc' | 'fecha_asc' | 'titulo_asc' | 'titulo_desc' | 'relevancia'
}

interface Sugerencia {
  id: string | null
  texto: string
  categoria: string | null
  tipo: 'documento' | 'sugerencia'
}

export default function BuscadorPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Cargando...</div>}>
      <BuscadorContent />
    </Suspense>
  )
}

function BuscadorContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [resultados, setResultados] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([])
  const [showSugerencias, setShowSugerencias] = useState(false)
  const [searchMetadata, setSearchMetadata] = useState<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const sugerenciasRef = useRef<HTMLDivElement>(null)
  const [filters, setFilters] = useState<FilterState>({
    categorias: [],
    fechaDesde: '',
    fechaHasta: '',
    ordenarPor: 'relevancia'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const saved = localStorage.getItem('legalRecentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }

    // If there's a query param, search immediately
    const urlQuery = searchParams.get('q')
    if (urlQuery) {
      setQuery(urlQuery)
      buscar(1, urlQuery)
    }
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sugerenciasRef.current && !sugerenciasRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSugerencias(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search for suggestions
  const fetchSugerencias = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSugerencias([])
      return
    }

    try {
      const res = await fetch(`/api/busqueda/sugerencias?q=${encodeURIComponent(term)}`)
      if (res.ok) {
        const data = await res.json()
        setSugerencias(data.sugerencias || [])
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchSugerencias(query)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, fetchSugerencias])

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
    setShowSugerencias(false)
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

    try {
      const res = await fetch(`/api/busqueda?${params}`)
      const data = await res.json()

      setResultados(data.documentos || [])
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
      setSearchMetadata(data.metadata || null)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    buscar(1)
  }

  const handleFiltersApply = (newFilters: FilterState) => {
    setFilters(newFilters)
    if (searched && query.length >= 2) {
      setTimeout(() => buscar(1), 100)
    }
  }

  const handleSugerenciaClick = (sugerencia: Sugerencia) => {
    setQuery(sugerencia.texto)
    setShowSugerencias(false)
    buscar(1, sugerencia.texto)
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
          Busca en legislacion, jurisprudencia, doctrina y practicas juridicas
        </p>
      </div>

      {/* Search Form */}
      <Card className="max-w-4xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar leyes, decretos, articulos..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setShowSugerencias(true)
                    }}
                    onFocus={() => query.length >= 2 && setShowSugerencias(true)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('')
                        setSugerencias([])
                        searchInputRef.current?.focus()
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Suggestions dropdown */}
                {showSugerencias && sugerencias.length > 0 && (
                  <div
                    ref={sugerenciasRef}
                    className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
                  >
                    {sugerencias.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSugerenciaClick(sug)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-400">
                          {sug.tipo === 'documento' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          )}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-800 line-clamp-1">{sug.texto}</p>
                          {sug.categoria && (
                            <p className="text-xs text-gray-500">{sug.categoria.replace('_', ' ')}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" loading={loading} className="px-8">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <AdvancedFilters onApply={handleFiltersApply} />

            {/* Quick Category Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'LEGISLACION', label: 'Legislacion', color: 'blue' },
                { value: 'JURISPRUDENCIA', label: 'Jurisprudencia', color: 'green' },
                { value: 'DOCTRINA', label: 'Doctrina', color: 'purple' },
                { value: 'PRACTICA_JURIDICA', label: 'Practica', color: 'orange' }
              ].map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    const newCategorias = filters.categorias.includes(cat.value)
                      ? filters.categorias.filter(c => c !== cat.value)
                      : [...filters.categorias, cat.value]
                    handleFiltersApply({ ...filters, categorias: newCategorias })
                  }}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filters.categorias.includes(cat.value)
                      ? `bg-${cat.color}-600 text-white border-${cat.color}-600`
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                  style={filters.categorias.includes(cat.value) ? {
                    backgroundColor: cat.color === 'blue' ? '#2563eb' :
                                    cat.color === 'green' ? '#16a34a' :
                                    cat.color === 'purple' ? '#9333ea' : '#ea580c',
                    color: 'white',
                    borderColor: cat.color === 'blue' ? '#2563eb' :
                                 cat.color === 'green' ? '#16a34a' :
                                 cat.color === 'purple' ? '#9333ea' : '#ea580c'
                  } : {}}
                >
                  {cat.label}
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
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 text-sm transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {!searched && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Busquedas sugeridas</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <SuggestionCard
              icon="📜"
              title="Ley de Municipalidades"
              description="Normativa sobre gobiernos locales y atribuciones municipales"
              onClick={() => handleRecentSearch('Ley Organica de Municipalidades')}
            />
            <SuggestionCard
              icon="🔍"
              title="Probidad Administrativa"
              description="Principios eticos y transparencia en la administracion publica"
              onClick={() => handleRecentSearch('probidad administrativa')}
            />
            <SuggestionCard
              icon="📋"
              title="Procedimiento Administrativo"
              description="Ley 19.880 y tramitacion de actos administrativos"
              onClick={() => handleRecentSearch('Ley 19.880 procedimiento administrativo')}
            />
            <SuggestionCard
              icon="🏛️"
              title="Contratacion Publica"
              description="Ley de Compras y contrataciones del Estado"
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
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearched(false)
                      setQuery('')
                      setFilters({
                        categorias: [],
                        fechaDesde: '',
                        fechaHasta: '',
                        ordenarPor: 'relevancia'
                      })
                    }}
                  >
                    Nueva busqueda
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRecentSearch('municipalidad')}
                  >
                    Buscar "municipalidad"
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <p className="text-gray-800 font-medium">
                    {pagination.total} resultado{pagination.total !== 1 ? 's' : ''} para "{query}"
                  </p>
                  {searchMetadata?.relatedCategories && searchMetadata.relatedCategories.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Encontrados en: {searchMetadata.relatedCategories.map((c: string) => c.replace('_', ' ')).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <select
                    value={filters.ordenarPor}
                    onChange={(e) => handleFiltersApply({ ...filters, ordenarPor: e.target.value as FilterState['ordenarPor'] })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevancia">Mas relevantes</option>
                    <option value="fecha_desc">Mas recientes</option>
                    <option value="fecha_asc">Mas antiguos</option>
                    <option value="titulo_asc">Titulo A-Z</option>
                  </select>
                  <button
                    onClick={() => {
                      setSearched(false)
                      setQuery('')
                    }}
                    className="text-blue-600 hover:underline text-sm whitespace-nowrap"
                  >
                    Nueva busqueda
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {resultados.map((doc, index) => (
                  <ResultadoCard
                    key={doc.id}
                    documento={doc}
                    query={query}
                    position={index + 1 + (pagination.page - 1) * 10}
                  />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => buscar(pagination.page - 1)}
                  >
                    Anterior
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNum = pagination.page <= 3
                        ? i + 1
                        : pagination.page >= pagination.pages - 2
                          ? pagination.pages - 4 + i
                          : pagination.page - 2 + i
                      if (pageNum < 1 || pageNum > pagination.pages) return null
                      return (
                        <button
                          key={pageNum}
                          onClick={() => buscar(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            pagination.page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
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
  icon,
  title,
  description,
  onClick
}: {
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </button>
  )
}

function ResultadoCard({
  documento,
  query,
  position
}: {
  documento: any
  query: string
  position: number
}) {
  const [expanded, setExpanded] = useState(false)

  const categoriaBadge: Record<string, { bg: string, text: string }> = {
    LEGISLACION: { bg: 'bg-blue-100', text: 'text-blue-800' },
    JURISPRUDENCIA: { bg: 'bg-green-100', text: 'text-green-800' },
    DOCTRINA: { bg: 'bg-purple-100', text: 'text-purple-800' },
    PRACTICA_JURIDICA: { bg: 'bg-orange-100', text: 'text-orange-800' }
  }

  // Highlight matches
  const highlightText = (text: string, maxLength?: number) => {
    if (!text) return ''
    let displayText = text
    if (maxLength && text.length > maxLength) {
      displayText = text.slice(0, maxLength) + '...'
    }

    if (!query) return displayText

    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2)
    const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
    const parts = displayText.split(regex)

    return parts.map((part, i) =>
      terms.some(term => part.toLowerCase() === term) ? (
        <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark>
      ) : part
    )
  }

  const cat = categoriaBadge[documento.categoria] || { bg: 'bg-gray-100', text: 'text-gray-800' }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm font-medium">#{position}</span>
            <h3 className="text-lg font-semibold text-gray-800">
              {highlightText(documento.titulo)}
            </h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${cat.bg} ${cat.text}`}>
            {documento.categoria.replace('_', ' ')}
          </span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {highlightText(documento.snippet || documento.resumen, 300)}
        </p>

        {expanded && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="font-medium text-gray-700 mb-2">Contenido completo:</h4>
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {highlightText(documento.contenido)}
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              {new Date(documento.createdAt).toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            {documento.relevanceScore && (
              <span className="text-gray-400" title="Puntuacion de relevancia">
                Relevancia: {documento.relevanceScore}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              {expanded ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Ver menos
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Ver mas
                </>
              )}
            </button>
            {documento.enlace && (
              <a
                href={documento.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Fuente
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
