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
    days.push(<div key={`empty-${i}`} className="min-h-28 p-3" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day)
    days.push(
      <div
        key={day}
        className={cn(
          "min-h-28 border border-border p-3 cursor-pointer hover:bg-accent/50 transition-all hover:shadow-md",
          isToday(day) && "bg-primary/5 border-primary/50 ring-2 ring-primary/20",
        )}
        onClick={() => onDateClick(new Date(year, month, day))}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full",
              isToday(day) && "bg-primary text-primary-foreground",
            )}
          >
            {day}
          </span>
        </div>
        <div className="space-y-1.5">
          {dayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
              className={cn(
                "text-xs px-2.5 py-1.5 rounded-md truncate cursor-pointer hover:opacity-80 transition-all font-medium shadow-sm",
                event.type === "income" &&
                  "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/20",
                event.type === "expense" && "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/20",
                event.type === "normal" && "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20",
              )}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-muted-foreground px-2.5 font-medium">+{dayEvents.length - 3} más</div>
          )}
        </div>
      </div>,
    )
  }

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <Card className="p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold capitalize">
          {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="rounded-full hover:bg-primary/10 bg-transparent"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="rounded-full px-6">
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="rounded-full hover:bg-primary/10 bg-transparent"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 border border-border rounded-xl overflow-hidden shadow-sm">
        {weekDays.map((day) => (
          <div key={day} className="bg-muted/70 p-4 text-center text-sm font-bold border-b border-border">
            {day}
          </div>
        ))}
        {days}
      </div>
    </Card>
  )
}
