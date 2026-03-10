'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface AdminStats {
  usuarios: {
    total: number
    admins: number
    usuarios: number
    nuevosEsteMes: number
  }
  documentos: {
    total: number
    porCategoria: Record<string, number>
    recientes: Array<{
      id: string
      titulo: string
      categoria: string
      createdAt: string
    }>
  }
  chat: {
    totalConsultas: number
    consultasHoy: number
    consultasSemana: number
  }
  newsletters: {
    total: number
    enviados: number
    pendientes: number
  }
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchAdminStats()
    }
  }, [session])

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/dashboard/admin')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
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

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administracion</h1>
          <p className="text-gray-600 mt-1">
            Vision general del sistema
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin">
            <Button variant="outline">Gestionar Contenido</Button>
          </Link>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Usuarios"
          value={stats?.usuarios.total || 0}
          subtitle={`+${stats?.usuarios.nuevosEsteMes || 0} este mes`}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Documentos"
          value={stats?.documentos.total || 0}
          subtitle="En biblioteca"
          icon="📚"
          color="green"
        />
        <StatCard
          title="Consultas IA"
          value={stats?.chat.totalConsultas || 0}
          subtitle={`${stats?.chat.consultasHoy || 0} hoy`}
          icon="🤖"
          color="purple"
        />
        <StatCard
          title="Newsletters"
          value={stats?.newsletters.total || 0}
          subtitle={`${stats?.newsletters.enviados || 0} enviados`}
          icon="📧"
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Documents by Category */}
        <div className="lg:col-span-2">
          <Card title="Documentos por Categoria">
            <div className="space-y-4">
              {stats?.documentos.porCategoria && Object.entries(stats.documentos.porCategoria).map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">{cat.replace('_', ' ')}</span>
                      <span className="text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(cat)}`}
                        style={{ width: `${(count / (stats?.documentos.total || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Documents */}
          <Card title="Documentos Recientes" className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Titulo</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Categoria</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.documentos.recientes?.map(doc => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{doc.titulo}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(doc.categoria)}`}>
                          {doc.categoria.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(doc.createdAt).toLocaleDateString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Users Distribution */}
          <Card title="Distribucion de Usuarios">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Administradores</span>
                <span className="font-bold text-blue-600">{stats?.usuarios.admins || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Usuarios</span>
                <span className="font-bold text-green-600">{stats?.usuarios.usuarios || 0}</span>
              </div>
            </div>
          </Card>

          {/* Chat Stats */}
          <Card title="Actividad del Chat IA">
            <div className="space-y-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {stats?.chat.consultasHoy || 0}
                </div>
                <div className="text-gray-600 text-sm">Consultas hoy</div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Esta semana</span>
                <span className="font-medium">{stats?.chat.consultasSemana || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total historico</span>
                <span className="font-medium">{stats?.chat.totalConsultas || 0}</span>
              </div>
            </div>
          </Card>

          {/* Newsletter Stats */}
          <Card title="Estado Newsletters">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Enviados</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {stats?.newsletters.enviados || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pendientes</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {stats?.newsletters.pendientes || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Acciones Rapidas">
            <div className="space-y-3">
              <Link href="/admin" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📄</span> Nuevo Documento
                </Button>
              </Link>
              <Link href="/admin" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📧</span> Crear Newsletter
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-8">
        <Card title="Estado del Sistema">
          <div className="grid md:grid-cols-4 gap-6">
            <HealthIndicator label="Base de Datos" status="healthy" />
            <HealthIndicator label="API IA" status="healthy" />
            <HealthIndicator label="Email" status="warning" detail="Sin API key" />
            <HealthIndicator label="Almacenamiento" status="healthy" />
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color
}: {
  title: string
  value: number
  subtitle: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600'
  }

  return (
    <div className={`p-6 rounded-xl text-white ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-white/70 text-sm mt-2">{subtitle}</p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  )
}

function HealthIndicator({
  label,
  status,
  detail
}: {
  label: string
  status: 'healthy' | 'warning' | 'error'
  detail?: string
}) {
  const statusConfig = {
    healthy: { color: 'bg-green-500', text: 'Operativo' },
    warning: { color: 'bg-yellow-500', text: 'Advertencia' },
    error: { color: 'bg-red-500', text: 'Error' }
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <div className={`w-3 h-3 rounded-full ${statusConfig[status].color}`}></div>
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{detail || statusConfig[status].text}</p>
      </div>
    </div>
  )
}

function getCategoryColor(cat: string): string {
  const colors: Record<string, string> = {
    LEGISLACION: 'bg-blue-500',
    JURISPRUDENCIA: 'bg-green-500',
    DOCTRINA: 'bg-purple-500',
    PRACTICA_JURIDICA: 'bg-orange-500'
  }
  return colors[cat] || 'bg-gray-500'
}

function getCategoryBadge(cat: string): string {
  const badges: Record<string, string> = {
    LEGISLACION: 'bg-blue-100 text-blue-800',
    JURISPRUDENCIA: 'bg-green-100 text-green-800',
    DOCTRINA: 'bg-purple-100 text-purple-800',
    PRACTICA_JURIDICA: 'bg-orange-100 text-orange-800'
  }
  return badges[cat] || 'bg-gray-100 text-gray-800'
}
