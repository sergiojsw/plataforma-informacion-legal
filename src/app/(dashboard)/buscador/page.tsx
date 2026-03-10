'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

const categorias = [
  { value: '', label: 'Todas' },
  { value: 'LEGISLACION', label: 'Legislación' },
  { value: 'JURISPRUDENCIA', label: 'Jurisprudencia' },
  { value: 'DOCTRINA', label: 'Doctrina' },
  { value: 'PRACTICA_JURIDICA', label: 'Práctica Jurídica' }
]

export default function BuscadorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState('')
  const [resultados, setResultados] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const buscar = async (page = 1) => {
    if (query.length < 2) return

    setLoading(true)
    setSearched(true)

    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: '10',
      ...(categoria && { categoria })
    })

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

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Buscador Jurídico</h1>
        <p className="text-gray-600">
          Busca en nuestra base de documentos legales
        </p>
      </div>

      <Card className="max-w-3xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Escribe tu búsqueda..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <Button type="submit" loading={loading}>
              Buscar
            </Button>
          </div>
        </form>
      </Card>

      {searched && (
        <div className="max-w-3xl mx-auto">
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
                <p className="text-gray-500 text-lg">
                  No se encontraron resultados para "{query}"
                </p>
                <p className="text-gray-400 mt-2">
                  Intenta con otras palabras clave
                </p>
              </div>
            </Card>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                {pagination.total} resultado{pagination.total !== 1 ? 's' : ''} para "{query}"
              </p>

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
                    Página {pagination.page} de {pagination.pages}
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

function ResultadoCard({ documento, query }: { documento: any; query: string }) {
  const categoriaBadge: Record<string, string> = {
    LEGISLACION: 'bg-blue-100 text-blue-800',
    JURISPRUDENCIA: 'bg-green-100 text-green-800',
    DOCTRINA: 'bg-purple-100 text-purple-800',
    PRACTICA_JURIDICA: 'bg-orange-100 text-orange-800'
  }

  // Highlight matches
  const highlightText = (text: string) => {
    const regex = new RegExp(`(${query})`, 'gi')
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

      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-400 text-xs">
          {new Date(documento.createdAt).toLocaleDateString('es-CL')}
        </span>
        {documento.enlace && (
          <a
            href={documento.enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Ver fuente →
          </a>
        )}
      </div>
    </div>
  )
}
