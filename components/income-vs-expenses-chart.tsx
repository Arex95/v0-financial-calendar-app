"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Event } from "@/lib/local-storage"

interface IncomeVsExpensesChartProps {
  events: Event[]
}

export default function IncomeVsExpensesChart({ events }: IncomeVsExpensesChartProps) {
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { month: string; income: number; expenses: number }> = {}

    events.forEach((event) => {
      const date = new Date(event.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthLabel = date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthLabel, income: 0, expenses: 0 }
      }

      if (event.eventType === "income") {
        monthlyData[monthKey].income += event.amount
      } else {
        monthlyData[monthKey].expenses += event.amount
      }
    })

    return Object.values(monthlyData).sort((a, b) => {
      const [aYear, aMonth] = a.month.split(" ")
      const [bYear, bMonth] = b.month.split(" ")
      return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime()
    })
  }, [events])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Ingresos" />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Gastos" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
