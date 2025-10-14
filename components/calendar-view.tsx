'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { CalendarEvent } from '@/lib/types'
import { formatCurrency } from '@/lib/financial-utils'

interface CalendarViewProps {
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

const CalendarGridView = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: {
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}) => {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const today = new Date()
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const getEventsForDay = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0]
    return events.filter((event) => event.date.startsWith(dateStr))
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="border-r border-b p-2 h-24" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day)
    const date = new Date(year, month, day)
    days.push(
      <div
        key={day}
        className={`border-r border-b p-2 h-24 flex flex-col cursor-pointer hover:bg-muted/50 ${
          isToday(day) ? 'bg-accent/20' : ''
        }`}
        onClick={() => onDateClick(date)}
      >
        <span className={`font-medium ${isToday(day) ? 'text-primary font-bold' : ''}`}>
          {day}
        </span>
        <div className="flex-grow overflow-y-auto text-xs space-y-1 mt-1">
          {dayEvents.slice(0, 2).map((event) => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
              className={`p-1 rounded-md text-white ${
                event.type === 'income' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-muted-foreground">+{dayEvents.length - 2} more</div>
          )}
        </div>
      </div>
    )
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="grid grid-cols-7">
      {weekDays.map((day) => (
        <div key={day} className="text-center font-medium text-muted-foreground p-2 border-b border-r">
          {day}
        </div>
      ))}
      {days}
    </div>
  )
}

const CalendarListView = ({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}) => {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthEvents = events
    .filter((e) => {
      const d = new Date(e.date)
      return d.getFullYear() === year && d.getMonth() === month
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (monthEvents.length === 0) {
    return <p className="text-muted-foreground text-center p-8">No events for this month.</p>
  }

  return (
    <div className="space-y-4 p-4">
      {monthEvents.map((event) => (
        <div
          key={event.id}
          onClick={() => onEventClick(event)}
          className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer"
        >
          <div className="flex-shrink-0 w-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}
            </p>
            <p className="text-xl font-bold">
              {new Date(event.date).getDate()}
            </p>
          </div>
          <div className="flex-grow">
            <p className="font-semibold">{event.title}</p>
            <p className="text-sm text-muted-foreground">{event.category || 'General'}</p>
          </div>
          <div className="text-right">
            <p
              className={`font-bold ${
                event.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {event.type === 'income' ? '+' : '-'}
              {formatCurrency(event.amount || 0)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CalendarView({ events, onDateClick, onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <Card>
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Vista de Grid para pantallas grandes */}
      <div className="hidden sm:block">
        <CalendarGridView
          currentDate={currentDate}
          events={events}
          onDateClick={onDateClick}
          onEventClick={onEventClick}
        />
      </div>

      {/* Vista de Lista para pantallas pequeñas */}
      <div className="block sm:hidden">
        <CalendarListView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
        />
      </div>
    </Card>
  )
}
