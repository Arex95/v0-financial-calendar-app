"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface House {
  id: string
  name: string
  totalExpenses?: number
}

interface HouseSelectorProps {
  selectedId?: string
  className?: string
}

export default function HouseSelector({ selectedId, className }: HouseSelectorProps) {
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch("/api/houses")
        if (response.ok) {
          const data = await response.json()
          setHouses(data)
        }
      } catch (error) {
        console.error("Error fetching houses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHouses()
  }, [])

  if (loading) {
    return <div className="text-sm text-gray-600 dark:text-gray-400">Loading houses...</div>
  }

  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
      <Link
        href="/dashboard"
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1",
          !selectedId
            ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700",
        )}
      >
        <Building2 className="w-3.5 h-3.5" />
        All Houses
      </Link>

      {houses.map((house) => (
        <Link
          key={house.id}
          href={`/dashboard/${house.id}`}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
            selectedId === house.id
              ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700",
          )}
        >
          {house.name}
        </Link>
      ))}
    </div>
  )
}
