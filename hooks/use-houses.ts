"use client"

import { useCallback, useEffect, useState } from "react"

export interface House {
  id: string
  name: string
  totalExpenses: number
}

export function useHouses() {
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHouses = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/houses")
      if (!response.ok) throw new Error("Failed to fetch houses")
      const data = await response.json()
      setHouses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  const addHouse = useCallback(
    async (name: string) => {
      try {
        const response = await fetch("/api/houses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        })
        if (!response.ok) throw new Error("Failed to add house")
        await fetchHouses()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    },
    [fetchHouses],
  )

  const deleteHouse = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/houses/${id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Failed to delete house")
        await fetchHouses()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    },
    [fetchHouses],
  )

  useEffect(() => {
    fetchHouses()
  }, [fetchHouses])

  return { houses, loading, error, addHouse, deleteHouse, refetch: fetchHouses }
}
