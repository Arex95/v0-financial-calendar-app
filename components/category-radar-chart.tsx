"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts"
import type { Event } from "@/lib/local-storage"

interface CategoryRadarChartProps {
  events: Event[]
}

export default function CategoryRadarChart({ events }: CategoryRadarChartProps) {
  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {}

    events.filter(e => e.eventType === "expense").forEach((event) => {
      if (!categoryTotals[event.category]) {
        categoryTotals[event.category] = 0
      }
      categoryTotals[event.category] += event.amount
    })

    return Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8) // Top 8 categories
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount),
      }))
  }, [events])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Gastos por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis />
            <Radar name="Gastos" dataKey="amount" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
