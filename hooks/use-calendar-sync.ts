"use client"

import { useEffect, useState } from "react"
import {
  type DashboardData,
  processCalendarEvents,
  saveDashboardData,
  loadDashboardData,
} from "@/lib/google-calendar-client"
import { getAccessToken } from "@/lib/google-auth-client"

export function useCalendarSync() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const syncCalendar = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = getAccessToken()
      if (!token) throw new Error("No authentication token")

      const response = await fetch("/api/calendar/events", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch calendar")

      const events = await response.json()
      const processedData = processCalendarEvents(events)

      saveDashboardData(processedData)
      setData(processedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cached = loadDashboardData()
    if (cached) setData(cached)
  }, [])

  return { data, loading, error, syncCalendar }
}
