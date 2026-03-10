'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface DashboardStats {
  totalDocumentos: number
  chatHistoryCount: number
  recentChats: Array<{
    id: string
    pregunta: string
    createdAt: string
  }>
  documentosPorCategoria: Record<string, number>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDashboardData()
      const saved = localStorage.getItem('legalRecentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard/user')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido, {session?.user?.name || 'Usuario'}
        </h1>
        <p className="text-gray-600 mt-1">
          Resumen de tu actividad en la plataforma
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <QuickStatCard
          icon="📚"
          label="Documentos Disponibles"
          value={stats?.totalDocumentos || 0}
          color="blue"
        />
        <QuickStatCard
          icon="💬"
          label="Consultas Realizadas"
          value={stats?.chatHistoryCount || 0}
          color="green"
        />
        <QuickStatCard
          icon="🔍"
          label="Busquedas Guardadas"
          value={recentSearches.length}
          color="purple"
        />
        <QuickStatCard
          icon="📧"
          label="Boletines Activos"
          value={2}
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Chat History */}
        <div className="lg:col-span-2">
          <Card title="Consultas Recientes al Asistente IA">
            {stats?.recentChats && stats.recentChats.length > 0 ? (
              <div className="space-y-4">
                {stats.recentChats.map(chat => (
                  <div
                    key={chat.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-gray-800 font-medium line-clamp-2">
                      {chat.pregunta}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {new Date(chat.createdAt).toLocaleDateString('es-CL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
                <Link href="/chat">
                  <Button variant="outline" className="w-full">
                    Ver todas las consultas
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Aun no has realizado consultas al asistente IA
                </p>
                <Link href="/chat">
                  <Button>Iniciar una consulta</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Searches */}
          <Card title="Busquedas Recientes">
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((search, i) => (
                  <Link
                    key={i}
                    href={`/buscador?q=${encodeURIComponent(search)}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700">{search}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Sin busquedas recientes
              </p>
            )}
          </Card>

          {/* Categories Distribution */}
          <Card title="Documentos por Categoria">
            <div className="space-y-3">
              {stats?.documentosPorCategoria && Object.entries(stats.documentosPorCategoria).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-gray-600">{cat.replace('_', ' ')}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Acciones Rapidas">
            <div className="space-y-3">
              <Link href="/biblioteca" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📚</span> Explorar Biblioteca
                </Button>
              </Link>
              <Link href="/buscador" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">🔍</span> Buscar Documentos
                </Button>
              </Link>
              <Link href="/chat" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">🤖</span> Consultar IA
                </Button>
              </Link>
              <Link href="/boletin" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📬</span> Ver Boletines
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8">
        <Card>
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Consejo del dia</h3>
              <p className="text-gray-600">
                Utiliza el buscador con terminos especificos como "Ley 18.695" o "articulo 5"
                para encontrar resultados mas precisos. Tambien puedes combinar filtros por
                categoria y rango de fechas para refinar tu busqueda.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function QuickStatCard({
  icon,
  label,
  value,
  color
}: {
  icon: string
  label: string
  value: number
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  }

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-gray-600 text-sm mt-1">{label}</div>
    </div>
  )
}
