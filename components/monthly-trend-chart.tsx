"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { FinancialStats } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"

interface MonthlyTrendChartProps {
  stats: FinancialStats
}

export function MonthlyTrendChart({ stats }: MonthlyTrendChartProps) {
  if (stats.monthlyTrend.length === 0) {
    return (
      <Card className="p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4">Tendencia mensual</h3>
        <p className="text-muted-foreground text-center py-8 text-sm">
          No hay datos suficientes para mostrar la tendencia
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold mb-4">Tendencia mensual (últimos 6 meses)</h3>
      <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
        <BarChart data={stats.monthlyTrend}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" tickFormatter={(value) => `€${value}`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="income" name="Ingresos" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Gastos" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
