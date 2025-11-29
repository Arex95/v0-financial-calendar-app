"use client"

import { useState, useMemo } from "react"
import { getFinancialData } from "@/lib/local-storage"
import Layout from "@/components/kokonutui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 10

export default function TransactionsPage() {
  const data = getFinancialData()
  const [selectedFilter, setSelectedFilter] = useState<string>("global")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)

  // Combine all events
  const allEvents = useMemo(() => {
    return [...data.events, ...data.personalEvents]
  }, [data.events, data.personalEvents])

  // Filter events based on selection - FIXED LOGIC
  const filteredEvents = useMemo(() => {
    if (selectedFilter === "global") {
      return allEvents
    } else if (selectedFilter === "personal") {
      return data.personalEvents
    } else {
      // Filter by specific entity - only show events that belong to this entity
      return allEvents.filter(event => event.entityId === selectedFilter)
    }
  }, [selectedFilter, allEvents, data.personalEvents])

  // Sort events by date
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })
  }, [filteredEvents, sortOrder])

  // Pagination
  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE)
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return sortedEvents.slice(startIndex, endIndex)
  }, [sortedEvents, currentPage])

  const entities = Object.values(data.entities)

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc")
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Transacciones</h1>
            <p className="text-muted-foreground mt-1">
              Todas tus transacciones en un solo lugar
            </p>
          </div>

          {/* Filter Selector */}
          <div className="w-full sm:w-64">
            <Select value={selectedFilter} onValueChange={handleFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">🌐 Global (Todas)</SelectItem>
                <SelectItem value="personal">👤 Personal</SelectItem>
                {entities.map(entity => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.type === "House" ? "🏠" : entity.type === "Car" ? "🚗" : entity.type === "Person" ? "👤" : "📁"} {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transacciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sortedEvents.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${sortedEvents
                  .filter(e => e.eventType === "income")
                  .reduce((sum, e) => sum + e.amount, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${sortedEvents
                  .filter(e => e.eventType === "expense")
                  .reduce((sum, e) => sum + e.amount, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedFilter === "global"
                  ? "Todas las Transacciones"
                  : selectedFilter === "personal"
                    ? "Transacciones Personales"
                    : `Transacciones de ${entities.find(e => e.id === selectedFilter)?.name}`}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages || 1}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th
                      className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      onClick={toggleSortOrder}
                    >
                      <div className="flex items-center gap-2">
                        Fecha
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Entidad
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Categoría
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Descripción
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Monto
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay transacciones para mostrar
                      </td>
                    </tr>
                  ) : (
                    paginatedEvents.map((event) => {
                      const entity = event.entityId ? data.entities[event.entityId] : null
                      const isIncome = event.eventType === "income"

                      return (
                        <tr
                          key={event.id}
                          className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4 whitespace-nowrap">
                            {new Date(event.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isIncome
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                            >
                              {isIncome ? "Ingreso" : "Gasto"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {entity ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                {entity.name}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                Personal
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">{event.category}</td>
                          <td className="py-3 px-4 max-w-xs truncate" title={event.description}>
                            {event.description}
                          </td>
                          <td className={`text-right py-3 px-4 font-semibold whitespace-nowrap ${isIncome
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                            }`}>
                            {isIncome ? "+" : "-"}{event.currency} {event.amount.toFixed(2)}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedEvents.length)} de {sortedEvents.length} transacciones
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      typeof page === 'number' ? (
                        <Button
                          key={index}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="min-w-[36px]"
                        >
                          {page}
                        </Button>
                      ) : (
                        <span key={index} className="px-2 text-muted-foreground">
                          {page}
                        </span>
                      )
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
