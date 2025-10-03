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

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>()
  const [isLoading, setIsLoading] = useState(true)

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
      const endOfYear = new Date(now.getFullYear(), 11, 31)

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

  const stats = calculateFinancialStats(events)

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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background relative">
        <header className="border-b-2 border-glow-cyan bg-card/50 backdrop-blur-md sticky top-0 z-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />
          <div className="container mx-auto px-4 py-4 md:py-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg border border-primary glow-cyan">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-balance text-primary text-glow-cyan tracking-wider uppercase">
                    Calendario Financiero
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    <span className="text-secondary">●</span> Sincronizado con Google Calendar
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                <ThemeToggle />
                <Button
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  variant="outline"
                  size="lg"
                  className="border-2 border-muted-foreground/30 hover:border-destructive hover:text-destructive transition-all"
                >
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Cerrar sesión</span>
                </Button>
                <Button
                  onClick={handleNewEvent}
                  size="lg"
                  className="bg-primary hover:bg-primary/80 text-primary-foreground border-2 border-primary glow-cyan transition-all flex-1 sm:flex-none font-semibold uppercase tracking-wide"
                >
                  <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  <span className="hidden sm:inline">Nuevo evento</span>
                  <span className="sm:hidden">Nuevo</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 md:py-10">
          <Tabs defaultValue="calendar" className="space-y-6 md:space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12 md:h-14 p-1 bg-card border-2 border-primary/30 glow-cyan">
              <TabsTrigger
                value="calendar"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:glow-cyan text-sm md:text-base font-semibold uppercase tracking-wide transition-all"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendario</span>
                <span className="sm:hidden">Cal</span>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:glow-cyan text-sm md:text-base font-semibold uppercase tracking-wide transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              <CalendarView events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6 md:space-y-8">
              <FinancialSummary stats={stats} />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <MonthlyTrendChart stats={stats} />
                <TransactionsList events={events} onEventClick={handleEventClick} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <CategoryBreakdown title="Ingresos por categoría" categories={stats.incomeByCategory} type="income" />
                <CategoryBreakdown title="Gastos por categoría" categories={stats.expensesByCategory} type="expense" />
              </div>

              <DailyStatisticsTable events={events} onEventClick={handleEventClick} />
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
