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
            setMensajes(historial.slice(-20)) // Últimos 20 mensajes
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

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Asistente Jurídico IA</h1>
        <p className="text-gray-600 text-sm">
          Consulta sobre legislación chilena, jurisprudencia y prácticas legales
        </p>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {mensajes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Bienvenido al Asistente Jurídico
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Puedo ayudarte con consultas sobre legislación chilena,
              interpretación de leyes, jurisprudencia y prácticas jurídicas.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                '¿Qué dice la Ley 21.389 sobre deudores de pensiones?',
                '¿Cuáles son los plazos del procedimiento sumario?',
                'Explicar el recurso de protección'
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
          Las respuestas son orientativas y no constituyen asesoría legal profesional
        </p>
      </div>
    </div>
  )
}
