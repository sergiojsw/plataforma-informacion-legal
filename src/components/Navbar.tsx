'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span className="font-bold text-xl">LegalIA</span>
          </Link>

          {session && (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/biblioteca" className="hover:text-blue-200 transition-colors">
                Biblioteca
              </Link>
              <Link href="/buscador" className="hover:text-blue-200 transition-colors">
                Buscador
              </Link>
              <Link href="/chat" className="hover:text-blue-200 transition-colors">
                Chat IA
              </Link>
              <Link href="/boletin" className="hover:text-blue-200 transition-colors">
                Boletín
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-blue-200 transition-colors">
                  Admin
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}

            {/* Mobile menu button */}
            {session && (
              <button
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {session && menuOpen && (
          <div className="md:hidden py-4 border-t border-blue-800">
            <div className="flex flex-col gap-4">
              <Link href="/biblioteca" className="hover:text-blue-200">Biblioteca</Link>
              <Link href="/buscador" className="hover:text-blue-200">Buscador</Link>
              <Link href="/chat" className="hover:text-blue-200">Chat IA</Link>
              <Link href="/boletin" className="hover:text-blue-200">Boletín</Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-blue-200">Admin</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
