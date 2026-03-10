'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'

export default function BoletinPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [newsletters, setNewsletters] = useState<any[]>([])
  const [tipo, setTipo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchNewsletters()
    }
  }, [session, tipo])

  const fetchNewsletters = async () => {
    setLoading(true)
    const params = new URLSearchParams(tipo ? { tipo } : {})
    const res = await fetch(`/api/newsletter?${params}`)
    const data = await res.json()
    setNewsletters(data.newsletters || [])
    setLoading(false)
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Boletín Legal</h1>
          <p className="text-gray-600 mt-1">
            Novedades y actualizaciones jurídicas
          </p>
        </div>

        <div className="flex gap-2">
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
              Los boletines se envían automáticamente a tu correo
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
            <h3 className="font-semibold text-gray-800">Suscripción Automática</h3>
            <p className="text-gray-600 text-sm mt-1">
              Los boletines se envían automáticamente a tu correo registrado:
            </p>
            <ul className="text-gray-600 text-sm mt-2 list-disc list-inside">
              <li><strong>Diario:</strong> Novedades legales del día (lunes a viernes)</li>
              <li><strong>Semanal:</strong> Resumen de la semana (cada lunes)</li>
            </ul>
          </div>
        </div>
      </Card>
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
            <span className="ml-2 text-green-600">✓ Enviado</span>
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
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      </div>
    </div>
  )
}
