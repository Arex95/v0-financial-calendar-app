"use client"

import { useState, useEffect } from "react"
import { Calendar, BarChart3, Plus, LogOut, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "@/components/calendar-view"
import { EventDialog } from "@/components/event-dialog"
import { EventDetailsDialog } from "@/components/event-details-dialog"
import { FinancialSummary } from "@/components/financial-summary"
import { TransactionsList } from "@/components/transactions-list"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"
import { ThemeToggle } from "@/components/theme-toggle"
import { calculateFinancialStats } from "@/lib/financial-utils"
import type { CalendarEvent } from "@/lib/google-calendar"
import { DailyStatisticsTable } from "@/components/daily-statistics-table"
import { AuthGuard } from "@/components/auth-guard"
import { signOut, useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider" // Asegúrate de tener este componente
import { HorizontalSelector } from "@/components/ui/horizontal-selector"
import { UpcomingEvents } from "@/components/upcoming-events"
import { CreditCardCard, AddCreditCardCard } from "@/components/credit-card-card"


export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("calendar")
  const [statsView, setStatsView] = useState<"mensual" | "anual">("mensual")
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (session) {
      fetchEvents()
    }
  }, [session])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const now = new Date()
      const startOfYear = new Date(now.getFullYear(), 0, 1)
      const endOfYear = new Date(now.getFullYear() + 5, 11, 31) // Fetch events up to 5 years in the future

      const response = await fetch(
        `/api/calendar/events?timeMin=${startOfYear.toISOString()}&timeMax=${endOfYear.toISOString()}`,
      )

      if (!response.ok) throw new Error("Failed to fetch events")

      const data = await response.json()
      setEvents(data.events)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEvents = getFilteredEvents(events, statsView)
  const stats = calculateFinancialStats(filteredEvents, statsView, selectedMonth, selectedYear)

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, "id">) => {
    try {
      if (editingEvent) {
        const response = await fetch(`/api/calendar/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        })

        if (!response.ok) throw new Error("Failed to update event")

        toast({
          title: "Evento actualizado",
          description: "El evento se actualizó correctamente en Google Calendar",
        })
      } else {
        const response = await fetch("/api/calendar/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        })

        if (!response.ok) throw new Error("Failed to create event")

        toast({
          title: "Evento creado",
          description: "El evento se creó correctamente en Google Calendar",
        })
      }

      await fetchEvents()
      setEditingEvent(undefined)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el evento",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/calendar/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete event")

      toast({
        title: "Evento eliminado",
        description: "El evento se eliminó correctamente de Google Calendar",
      })

      await fetchEvents()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento",
        variant: "destructive",
      })
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setEditingEvent(undefined)
    setIsEventDialogOpen(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsDetailsDialogOpen(true)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setIsEventDialogOpen(true)
  }

  const handleNewEvent = () => {
    setSelectedDate(new Date())
    setEditingEvent(undefined)
    setIsEventDialogOpen(true)
  }

  function getFilteredEvents(
    events: CalendarEvent[],
    statsView: "mensual" | "anual"
  ) {
    if (statsView === "mensual") {
      return events.filter(e => {
        const d = new Date(e.date)
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
      })
    }
    if (statsView === "anual") {
      return events.filter(e => {
        const d = new Date(e.date)
        return d.getFullYear() === selectedYear
      })
    }
    return events // fallback, shouldn't happen
  }

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(selectedYear, i).toLocaleString("es-ES", { month: "long" })
  )
  const yearRange = Array.from({ length: 6 }, (_, i) => (now.getFullYear() - 5 + i).toString())

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-2 py-3 flex items-center justify-between gap-2">
            {/* Logotipo redondo */}
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary w-10 h-10 flex items-center justify-center shadow-md">
                {/* Puedes reemplazar el texto por un SVG o imagen */}
                <span className="text-white font-bold text-lg">FC</span>
              </div>
            </div>
            {/* Tabs en el header, controlados por activeTab */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 mx-2 max-w-xs">
              <TabsList className="grid grid-cols-2 h-10 p-1 bg-muted/50 rounded-full">
                <TabsTrigger value="calendar" className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline max-[400px]:hidden">Calendario</span>
                  <span className="sm:hidden max-[400px]:hidden">Cal</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline max-[400px]:hidden">Dashboard</span>
                  <span className="sm:hidden max-[400px]:hidden">Dash</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {/* Botones de acción compactos */}
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                variant="outline"
                size="icon"
                className="rounded-full p-2"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleNewEvent}
                size="icon"
                className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
                title="Nuevo evento"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 md:py-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
            <TabsContent value="calendar" className="space-y-6">
              <CalendarView events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />
            </TabsContent>
            <TabsContent value="dashboard" className="space-y-6 md:space-y-8">
              {/* Switch de estadísticas solo visible en dashboard */}
              <div className="flex flex-col items-center gap-4 mb-4">
                <Tabs value={statsView} onValueChange={setStatsView} className="w-full">
                  <TabsList className="flex flex-row h-9 w-full p-1 bg-muted/50 rounded-full">
                    <TabsTrigger value="mensual" className="rounded-full data-[state=active]:shadow text-xs">
                      Mensuales
                    </TabsTrigger>
                    <TabsTrigger value="anual" className="rounded-full data-[state=active]:shadow text-xs">
                      Anuales
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {/* Slider para seleccionar mes o año */}
                {statsView === "mensual" && (
                  <HorizontalSelector
                    items={monthNames}
                    selectedIndex={selectedMonth}
                    onSelect={setSelectedMonth}
                  />
                )}
                {statsView === "anual" && (
                  <HorizontalSelector
                    items={yearRange}
                    selectedIndex={yearRange.indexOf(selectedYear.toString())}
                    onSelect={idx => setSelectedYear(Number(yearRange[idx]))}
                  />
                )}
              </div>
              <FinancialSummary stats={stats} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <MonthlyTrendChart stats={stats} statsView={statsView} selectedMonth={selectedMonth} selectedYear={selectedYear} />
                <UpcomingEvents events={events} />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TransactionsList events={filteredEvents} onEventClick={handleEventClick} />
                <CategoryBreakdown title="Ingresos por categoría" categories={stats.incomeByCategory} type="income" />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <CategoryBreakdown title="Gastos por categoría" categories={stats.expensesByCategory} type="expense" />
                <DailyStatisticsTable events={filteredEvents} onEventClick={handleEventClick} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CreditCardCard cardName="My Bank" cardNumber="**** 1234" paidAmount={500} totalAmount={2000} />
                <AddCreditCardCard />
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <EventDialog
          open={isEventDialogOpen}
          onOpenChange={setIsEventDialogOpen}
          onSave={handleSaveEvent}
          selectedDate={selectedDate}
          event={editingEvent}
        />

        <EventDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          event={selectedEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </AuthGuard>
  )
}
