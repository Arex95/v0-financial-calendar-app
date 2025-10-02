import type { CalendarEvent } from "./types"

const STORAGE_KEY = "financial-calendar-events"

export const storage = {
  getEvents: (): CalendarEvent[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  saveEvents: (events: CalendarEvent[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  },

  addEvent: (event: CalendarEvent): void => {
    const events = storage.getEvents()
    events.push(event)
    storage.saveEvents(events)
  },

  updateEvent: (id: string, updatedEvent: Partial<CalendarEvent>): void => {
    const events = storage.getEvents()
    const index = events.findIndex((e) => e.id === id)
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent }
      storage.saveEvents(events)
    }
  },

  deleteEvent: (id: string): void => {
    const events = storage.getEvents()
    const filtered = events.filter((e) => e.id !== id)
    storage.saveEvents(filtered)
  },

  getEventsByMonth: (year: number, month: number): CalendarEvent[] => {
    const events = storage.getEvents()
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
  },
}
