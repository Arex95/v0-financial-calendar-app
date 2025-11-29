"use client"

import { useEffect, useState } from "react"

export interface CalendarExpense {
  id: string
  title: string
  amount: number
  date: string
  description: string
  house: string
}

export function useGoogleCalendar() {
  const [expenses, setExpenses] = useState<CalendarExpense[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const syncCalendar = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/calendar/sync", {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to sync calendar")
      const data = await response.json()
      setExpenses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    syncCalendar()
  }, [])

  return { expenses, loading, error, syncCalendar }
}
