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
    return <div className="text-sm text-muted-foreground">Loading houses...</div>
  }

  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
      <Link
        href="/dashboard"
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1",
          !selectedId
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80",
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
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
          )}
        >
          {house.name}
        </Link>
      ))}
    </div>
  )
}
