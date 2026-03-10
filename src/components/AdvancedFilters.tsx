'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface FilterState {
  categorias: string[]
  fechaDesde: string
  fechaHasta: string
  ordenarPor: 'fecha_desc' | 'fecha_asc' | 'titulo_asc' | 'titulo_desc'
}

interface AdvancedFiltersProps {
  onApply: (filters: FilterState) => void
  showCategorias?: boolean
  showFechas?: boolean
  showOrdenamiento?: boolean
}

const categoriasOptions = [
  { value: 'LEGISLACION', label: 'Legislacion' },
  { value: 'JURISPRUDENCIA', label: 'Jurisprudencia' },
  { value: 'DOCTRINA', label: 'Doctrina' },
  { value: 'PRACTICA_JURIDICA', label: 'Practica Juridica' }
]

const ordenOptions = [
  { value: 'fecha_desc', label: 'Mas recientes primero' },
  { value: 'fecha_asc', label: 'Mas antiguos primero' },
  { value: 'titulo_asc', label: 'Titulo A-Z' },
  { value: 'titulo_desc', label: 'Titulo Z-A' }
]

export function AdvancedFilters({
  onApply,
  showCategorias = true,
  showFechas = true,
  showOrdenamiento = true
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categorias: [],
    fechaDesde: '',
    fechaHasta: '',
    ordenarPor: 'fecha_desc'
  })

  const toggleCategoria = (cat: string) => {
    setFilters(prev => ({
      ...prev,
      categorias: prev.categorias.includes(cat)
        ? prev.categorias.filter(c => c !== cat)
        : [...prev.categorias, cat]
    }))
  }

  const handleApply = () => {
    onApply(filters)
    setIsOpen(false)
  }

  const handleReset = () => {
    const resetFilters: FilterState = {
      categorias: [],
      fechaDesde: '',
      fechaHasta: '',
      ordenarPor: 'fecha_desc'
    }
    setFilters(resetFilters)
    onApply(resetFilters)
  }

  const activeFiltersCount =
    filters.categorias.length +
    (filters.fechaDesde ? 1 : 0) +
    (filters.fechaHasta ? 1 : 0) +
    (filters.ordenarPor !== 'fecha_desc' ? 1 : 0)

  return (
    <div className="relative z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-gray-700">Filtros avanzados</span>
        {activeFiltersCount > 0 && (
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Filtros</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {showCategorias && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorias
              </label>
              <div className="flex flex-wrap gap-2">
                {categoriasOptions.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => toggleCategoria(cat.value)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.categorias.includes(cat.value)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showFechas && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de fechas
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Desde</label>
                  <input
                    type="date"
                    value={filters.fechaDesde}
                    onChange={(e) => setFilters(prev => ({ ...prev, fechaDesde: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Hasta</label>
                  <input
                    type="date"
                    value={filters.fechaHasta}
                    onChange={(e) => setFilters(prev => ({ ...prev, fechaHasta: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {showOrdenamiento && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={filters.ordenarPor}
                onChange={(e) => setFilters(prev => ({ ...prev, ordenarPor: e.target.value as FilterState['ordenarPor'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ordenOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
              Limpiar
            </Button>
            <Button size="sm" onClick={handleApply} className="flex-1">
              Aplicar
            </Button>
          </div>
        </div>
        </>
      )}
    </div>
  )
}
