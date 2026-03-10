'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const categorias = [
  { value: '', label: 'Todas las categorías' },
  { value: 'LEGISLACION', label: 'Legislación' },
  { value: 'JURISPRUDENCIA', label: 'Jurisprudencia' },
  { value: 'DOCTRINA', label: 'Doctrina' },
  { value: 'PRACTICA_JURIDICA', label: 'Práctica Jurídica' }
]

export default function BibliotecaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [documentos, setDocumentos] = useState<any[]>([])
  const [categoria, setCategoria] = useState('')
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDocumentos()
    }
  }, [session, categoria, pagination.page])

  const fetchDocumentos = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: '10',
      ...(categoria && { categoria })
    })

    const res = await fetch(`/api/documentos?${params}`)
    const data = await res.json()

    setDocumentos(data.documentos || [])
    setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
    setLoading(false)
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Biblioteca Jurídica</h1>
          <p className="text-gray-600 mt-1">
            {pagination.total} documentos disponibles
          </p>
        </div>

        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value)
            setPagination(p => ({ ...p, page: 1 }))
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categorias.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

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
            <p className="text-gray-500 text-lg">No hay documentos disponibles</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {documentos.map(doc => (
            <DocumentoCard key={doc.id} documento={doc} />
          ))}
        </div>
      )}

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
            Página {pagination.page} de {pagination.pages}
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
            Ver fuente externa →
          </a>
        )}
      </div>

      <p className="text-gray-400 text-sm mt-4">
        Actualizado: {new Date(documento.updatedAt).toLocaleDateString('es-CL')}
      </p>
    </div>
  )
}
