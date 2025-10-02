"use client"

import { useState, useEffect } from "react"
import { Calendar, BarChart3, Plus } from "lucide-react"
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
import { storage } from "@/lib/storage"
import { calculateFinancialStats } from "@/lib/financial-utils"
import type { CalendarEvent } from "@/lib/types"
import { DailyStatisticsTable } from "@/components/daily-statistics-table"

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>()

  useEffect(() => {
    setEvents(storage.getEvents())
  }, [])

  const stats = calculateFinancialStats(events)

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (editingEvent) {
      storage.updateEvent(editingEvent.id, eventData)
    } else {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: crypto.randomUUID(),
      }
      storage.addEvent(newEvent)
    }
    setEvents(storage.getEvents())
    setEditingEvent(undefined)
  }

  const handleDeleteEvent = (id: string) => {
    storage.deleteEvent(id)
    setEvents(storage.getEvents())
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-balance bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Calendario Financiero
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Gestiona tus finanzas y eventos en un solo lugar
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
              <ThemeToggle />
              <Button
                onClick={handleNewEvent}
                size="lg"
                className="rounded-full shadow-lg hover:shadow-xl transition-shadow flex-1 sm:flex-none"
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
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-11 md:h-12 p-1 bg-muted/50 rounded-full">
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md text-sm md:text-base"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendario</span>
              <span className="sm:hidden">Cal</span>
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 rounded-full data-[state=active]:shadow-md text-sm md:text-base"
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
  )
}
