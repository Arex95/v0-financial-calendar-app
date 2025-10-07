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
    days.push(<div key={`empty-${i}`} className="min-h-20 md:min-h-28 p-2 md:p-3" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day)
    days.push(
      <div
        key={day}
        className={cn(
          "min-h-20 md:min-h-28 border border-border p-2 md:p-3 cursor-pointer hover:bg-accent/50 transition-all hover:shadow-md",
          isToday(day) && "bg-primary/5 border-primary/50 ring-2 ring-primary/20",
        )}
        onClick={() => onDateClick(new Date(year, month, day))}
      >
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <span
            className={cn(
              "text-xs md:text-sm font-semibold w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full",
              isToday(day) && "bg-primary text-primary-foreground",
            )}
          >
            {day}
          </span>
        </div>
        <div className="space-y-1 md:space-y-1.5">
          {dayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
              className={cn(
                "text-[10px] md:text-xs px-1.5 md:px-2.5 py-1 md:py-1.5 rounded-md truncate cursor-pointer hover:opacity-80 transition-all font-medium shadow-sm",
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
            <div className="text-[10px] md:text-xs text-[var(--muted-foreground)] px-1.5 md:px-2.5 font-medium">
              +{dayEvents.length - 3} más
            </div>
          )}
        </div>
      </div>,
    )
  }

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const weekDaysMobile = ["D", "L", "M", "X", "J", "V", "S"]

  return (
    <Card className="p-4 md:p-8 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold capitalize">
          {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="rounded-full hover:bg-primary/10 bg-transparent h-9 w-9 md:h-10 md:w-10"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
            className="rounded-full px-4 md:px-6 flex-1 sm:flex-none text-sm md:text-base"
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="rounded-full hover:bg-primary/10 bg-transparent h-9 w-9 md:h-10 md:w-10"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 border border-border rounded-xl overflow-hidden shadow-sm">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className="bg-muted/70 p-2 md:p-4 text-center text-xs md:text-sm font-bold border-b border-border"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{weekDaysMobile[index]}</span>
          </div>
        ))}
        {days}
      </div>
    </Card>
  )
}
