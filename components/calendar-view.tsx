"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { CalendarEvent } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

export function CalendarView({ events, onDateClick, onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const today = new Date()
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const getEventsForDay = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0]
    return events.filter((event) => event.date.startsWith(dateStr))
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-24 p-2" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day)
    days.push(
      <div
        key={day}
        className={cn(
          "min-h-24 border border-border p-2 cursor-pointer hover:bg-accent/50 transition-colors",
          isToday(day) && "bg-primary/10 border-primary",
        )}
        onClick={() => onDateClick(new Date(year, month, day))}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={cn("text-sm font-medium", isToday(day) && "text-primary font-bold")}>{day}</span>
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
              className={cn(
                "text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80",
                event.type === "income" && "bg-green-500/20 text-green-700 dark:text-green-300",
                event.type === "expense" && "bg-red-500/20 text-red-700 dark:text-red-300",
                event.type === "normal" && "bg-blue-500/20 text-blue-700 dark:text-blue-300",
              )}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-muted-foreground px-2">+{dayEvents.length - 3} más</div>
          )}
        </div>
      </div>,
    )
  }

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
        {weekDays.map((day) => (
          <div key={day} className="bg-muted p-3 text-center text-sm font-semibold border-b border-border">
            {day}
          </div>
        ))}
        {days}
      </div>
    </Card>
  )
}
