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
import { storage } from "@/lib/storage"
import { calculateFinancialStats } from "@/lib/financial-utils"
import type { CalendarEvent } from "@/lib/types"

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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-balance">Calendario Financiero</h1>
            <Button onClick={handleNewEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo evento
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendario
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarView events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <FinancialSummary stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyTrendChart stats={stats} />
              <TransactionsList events={events} onEventClick={handleEventClick} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryBreakdown title="Ingresos por categoría" categories={stats.incomeByCategory} type="income" />
              <CategoryBreakdown title="Gastos por categoría" categories={stats.expensesByCategory} type="expense" />
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
  )
}
