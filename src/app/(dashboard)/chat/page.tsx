'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface Mensaje {
  id: string
  tipo: 'usuario' | 'asistente'
  contenido: string
  timestamp: Date
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  useEffect(() => {
    // Cargar historial
    if (session) {
      fetch('/api/chat')
        .then(res => res.json())
        .then(data => {
          if (data.historial) {
            const historial = data.historial.reverse().flatMap((h: any) => [
              {
                id: `${h.id}-q`,
                tipo: 'usuario' as const,
                contenido: h.pregunta,
                timestamp: new Date(h.createdAt)
              },
              {
                id: `${h.id}-r`,
                tipo: 'asistente' as const,
                contenido: h.respuesta,
                timestamp: new Date(h.createdAt)
              }
            ])
            setMensajes(historial.slice(-20)) // Ultimos 20 mensajes
          }
        })
    }
  }, [session])

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const pregunta = input.trim()
    setInput('')
    setLoading(true)

    // Agregar mensaje del usuario
    const userMsg: Mensaje = {
      id: Date.now().toString(),
      tipo: 'usuario',
      contenido: pregunta,
      timestamp: new Date()
    }
    setMensajes(prev => [...prev, userMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta })
      })

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Agregar respuesta del asistente
      const assistantMsg: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'asistente',
        contenido: data.respuesta,
        timestamp: new Date()
      }
      setMensajes(prev => [...prev, assistantMsg])
    } catch (error: any) {
      const errorMsg: Mensaje = {
        id: (Date.now() + 1).toString(),
        tipo: 'asistente',
        contenido: `Error: ${error.message || 'No se pudo procesar tu consulta'}`,
        timestamp: new Date()
      }
      setMensajes(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const limpiarHistorial = async () => {
    setClearing(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'DELETE'
      })

      if (res.ok) {
        setMensajes([])
        setShowClearModal(false)
      } else {
        alert('Error al limpiar el historial')
      }
    } catch (error) {
      console.error('Error clearing history:', error)
      alert('Error al limpiar el historial')
    } finally {
      setClearing(false)
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Asistente Juridico IA</h1>
          <p className="text-gray-600 text-sm">
            Consulta sobre legislacion chilena, jurisprudencia y practicas legales
          </p>
        </div>
        {mensajes.length > 0 && (
          <button
            onClick={() => setShowClearModal(true)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-100"
            title="Limpiar historial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Modal de confirmacion */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Limpiar historial</h3>
              <p className="text-gray-600 text-sm mb-6">
                Esta accion eliminara todas tus consultas anteriores. Esta accion no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={clearing}
                >
                  Cancelar
                </button>
                <button
                  onClick={limpiarHistorial}
                  disabled={clearing}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {clearing ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {mensajes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Bienvenido al Asistente Juridico
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Puedo ayudarte con consultas sobre legislacion chilena,
              interpretacion de leyes, jurisprudencia y practicas juridicas.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                'Que dice la Ley de Municipalidades?',
                'Cuales son los plazos del procedimiento sumario?',
                'Explicar el recurso de proteccion'
              ].map((sugerencia, i) => (
                <button
                  key={i}
                  onClick={() => setInput(sugerencia)}
                  className="text-sm bg-white border border-gray-200 rounded-full px-4 py-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensajes.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.tipo === 'usuario'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white shadow-md rounded-bl-none'
              }`}
            >
              <p className={`whitespace-pre-wrap ${msg.tipo === 'asistente' ? 'text-gray-700' : ''}`}>
                {msg.contenido}
              </p>
              <p className={`text-xs mt-1 ${msg.tipo === 'usuario' ? 'text-blue-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={enviarMensaje} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta legal..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <Button type="submit" loading={loading} disabled={!input.trim()}>
            Enviar
          </Button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Las respuestas son orientativas y no constituyen asesoria legal profesional
        </p>
      </div>
    </div>
  )
}
