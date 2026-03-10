'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

const categorias = [
  { value: 'LEGISLACION', label: 'Legislación' },
  { value: 'JURISPRUDENCIA', label: 'Jurisprudencia' },
  { value: 'DOCTRINA', label: 'Doctrina' },
  { value: 'PRACTICA_JURIDICA', label: 'Práctica Jurídica' }
]

interface Usuario {
  id: string
  email: string
  nombre: string
  rol: string
  createdAt: string
  _count: { chatHistory: number }
}

// Usuarios demo protegidos
const DEMO_EMAILS = ['admin@legal.cl', 'usuario@legal.cl']

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'documentos' | 'newsletter' | 'usuarios'>('documentos')
  const [documentos, setDocumentos] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [userAction, setUserAction] = useState<{ id: string; action: string } | null>(null)

  // Form documento
  const [formDoc, setFormDoc] = useState({
    titulo: '',
    categoria: 'LEGISLACION',
    resumen: '',
    contenido: '',
    enlace: ''
  })

  // Form newsletter
  const [formNewsletter, setFormNewsletter] = useState({
    tipo: 'DIARIO',
    asunto: '',
    contenido: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/biblioteca')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchDocumentos()
    }
  }, [session])

  useEffect(() => {
    if (activeTab === 'usuarios' && session?.user?.role === 'ADMIN') {
      fetchUsuarios()
    }
  }, [activeTab, session])

  const fetchDocumentos = async () => {
    const res = await fetch('/api/documentos?limit=100')
    const data = await res.json()
    setDocumentos(data.documentos || [])
  }

  const fetchUsuarios = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/usuarios')
      const data = await res.json()
      setUsuarios(data.usuarios || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleChangeRole = async (userId: string, newRol: string) => {
    setUserAction({ id: userId, action: 'role' })
    try {
      const res = await fetch('/api/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rol: newRol })
      })
      if (res.ok) {
        fetchUsuarios()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al cambiar rol')
      }
    } catch (error) {
      alert('Error al cambiar rol')
    } finally {
      setUserAction(null)
    }
  }

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`¿Eliminar usuario ${email}? Esta accion no se puede deshacer.`)) return

    setUserAction({ id: userId, action: 'delete' })
    try {
      const res = await fetch(`/api/usuarios?id=${userId}`, { method: 'DELETE' })
      if (res.ok) {
        fetchUsuarios()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al eliminar usuario')
      }
    } catch (error) {
      alert('Error al eliminar usuario')
    } finally {
      setUserAction(null)
    }
  }

  const handleSubmitDoc = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/documentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDoc)
      })

      if (res.ok) {
        setFormDoc({
          titulo: '',
          categoria: 'LEGISLACION',
          resumen: '',
          contenido: '',
          enlace: ''
        })
        fetchDocumentos()
        alert('Documento creado exitosamente')
      } else {
        const data = await res.json()
        alert(data.error || 'Error al crear documento')
      }
    } catch (error) {
      alert('Error al crear documento')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitNewsletter = async (e: React.FormEvent, enviar: boolean) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formNewsletter, enviar })
      })

      if (res.ok) {
        setFormNewsletter({ tipo: 'DIARIO', asunto: '', contenido: '' })
        alert(enviar ? 'Newsletter enviado exitosamente' : 'Newsletter guardado como borrador')
      } else {
        const data = await res.json()
        alert(data.error || 'Error')
      }
    } catch (error) {
      alert('Error')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b">
        {[
          { id: 'documentos', label: 'Documentos' },
          { id: 'newsletter', label: 'Newsletter' },
          { id: 'usuarios', label: 'Usuarios' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Documentos */}
      {activeTab === 'documentos' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card title="Nuevo Documento">
            <form onSubmit={handleSubmitDoc} className="space-y-4">
              <Input
                label="Título"
                value={formDoc.titulo}
                onChange={(e) => setFormDoc({ ...formDoc, titulo: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formDoc.categoria}
                  onChange={(e) => setFormDoc({ ...formDoc, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resumen
                </label>
                <textarea
                  value={formDoc.resumen}
                  onChange={(e) => setFormDoc({ ...formDoc, resumen: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido
                </label>
                <textarea
                  value={formDoc.contenido}
                  onChange={(e) => setFormDoc({ ...formDoc, contenido: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <Input
                label="Enlace externo (opcional)"
                type="url"
                value={formDoc.enlace}
                onChange={(e) => setFormDoc({ ...formDoc, enlace: e.target.value })}
                placeholder="https://..."
              />

              <Button type="submit" loading={loading} className="w-full">
                Crear Documento
              </Button>
            </form>
          </Card>

          <Card title={`Documentos (${documentos.length})`}>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {documentos.map(doc => (
                <div
                  key={doc.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h4 className="font-medium text-gray-800">{doc.titulo}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {doc.categoria.replace('_', ' ')} • {new Date(doc.createdAt).toLocaleDateString('es-CL')}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Newsletter */}
      {activeTab === 'newsletter' && (
        <Card title="Crear Newsletter" className="max-w-2xl">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formNewsletter.tipo}
                onChange={(e) => setFormNewsletter({ ...formNewsletter, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DIARIO">Boletín Diario</option>
                <option value="SEMANAL">Boletín Semanal</option>
              </select>
            </div>

            <Input
              label="Asunto"
              value={formNewsletter.asunto}
              onChange={(e) => setFormNewsletter({ ...formNewsletter, asunto: e.target.value })}
              placeholder="Novedades Legales - 9 de marzo 2026"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido (HTML permitido)
              </label>
              <textarea
                value={formNewsletter.contenido}
                onChange={(e) => setFormNewsletter({ ...formNewsletter, contenido: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="<h2>Título</h2><p>Contenido...</p>"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmitNewsletter(e, false)}
                loading={loading}
              >
                Guardar Borrador
              </Button>
              <Button
                type="button"
                onClick={(e) => handleSubmitNewsletter(e, true)}
                loading={loading}
              >
                Enviar Ahora
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab: Usuarios */}
      {activeTab === 'usuarios' && (
        <Card title={`Gestion de Usuarios (${usuarios.length})`}>
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Usuario</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Rol</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Consultas</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Registro</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(user => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{user.nombre}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.rol}
                          onChange={(e) => handleChangeRole(user.id, e.target.value)}
                          disabled={user.id === session?.user?.id || userAction?.id === user.id || DEMO_EMAILS.includes(user.email)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                            user.rol === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          } ${(user.id === session?.user?.id || DEMO_EMAILS.includes(user.email)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="USUARIO">Usuario</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600">{user._count.chatHistory}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('es-CL')}
                      </td>
                      <td className="py-3 px-4">
                        {DEMO_EMAILS.includes(user.email) ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Demo
                          </span>
                        ) : user.id === session?.user?.id ? (
                          <span className="text-xs text-gray-400">Tu cuenta</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            disabled={userAction?.id === user.id}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            title="Eliminar usuario"
                          >
                            {userAction?.id === user.id && userAction.action === 'delete' ? (
                              <span className="animate-spin">⏳</span>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {usuarios.length === 0 && (
                <p className="text-center py-8 text-gray-500">No hay usuarios registrados</p>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
