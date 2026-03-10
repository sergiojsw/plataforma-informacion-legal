'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="Ir al inicio - LegalIA">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span className="font-bold text-xl">LegalIA</span>
          </Link>

          {session && (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="hover:text-blue-200 transition-colors">
                Dashboard
              </Link>
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
                Boletin
              </Link>
              {session.user.role === 'ADMIN' && (
                <div className="relative group">
                  <button className="hover:text-blue-200 transition-colors flex items-center gap-1 py-2">
                    Admin
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Puente invisible para mantener hover */}
                  <div className="absolute top-full left-0 h-2 w-48 hidden group-hover:block"></div>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-3 text-gray-800 hover:bg-blue-50 transition-colors"
                    >
                      Panel General
                    </Link>
                    <Link
                      href="/admin"
                      className="block px-4 py-3 text-gray-800 hover:bg-blue-50 transition-colors"
                    >
                      Gestionar Contenido
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:bg-blue-800 px-3 py-2 rounded-lg transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="Menu de usuario"
                >
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-sm font-medium" aria-hidden="true">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm">
                    {session.user.name}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{session.user.name}</p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                        session.user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                      </span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Mi Dashboard
                      </span>
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Panel Admin
                        </span>
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Cerrar Sesion
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Iniciar Sesion
              </Link>
            )}

            {/* Mobile menu button */}
            {session && (
              <button
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
                aria-controls="mobile-menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {session && menuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-blue-800" role="navigation" aria-label="Menu de navegacion movil">
            <div className="flex flex-col gap-4">
              <Link href="/dashboard" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link href="/biblioteca" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                Biblioteca
              </Link>
              <Link href="/buscador" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                Buscador
              </Link>
              <Link href="/chat" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                Chat IA
              </Link>
              <Link href="/boletin" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                Boletin
              </Link>
              {session.user.role === 'ADMIN' && (
                <>
                  <div className="border-t border-blue-800 pt-4 mt-2">
                    <p className="text-blue-300 text-sm mb-2">Administracion</p>
                  </div>
                  <Link href="/admin/dashboard" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                    Panel General
                  </Link>
                  <Link href="/admin" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                    Gestionar Contenido
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
