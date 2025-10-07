"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { FinancialStats } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"

interface MonthlyTrendChartProps {
  stats: FinancialStats
  statsView?: "mensual" | "anual"
  selectedMonth?: number
  selectedYear?: number
}

export function MonthlyTrendChart({ stats, statsView = "mensual", selectedMonth, selectedYear }: MonthlyTrendChartProps) {
  if (stats.monthlyTrend.length === 0) {
    return (
      <Card className="card-base">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-primary">
          {statsView === "anual" ? "Tendencia anual" : "Tendencia mensual"}
        </h3>
        <p className="text-[var(--muted-foreground)] text-center py-8 text-sm">
          No hay datos suficientes para mostrar la tendencia
        </p>
      </Card>
    )
  }

  return (
    <Card className="card-base">
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--primary)" }}>
          {statsView === "anual" ? "Tendencia anual" : "Tendencia mensual"}
        </h3>
        <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
          {statsView === "anual" ? `Año ${selectedYear}` : 
           `${new Date(selectedYear, selectedMonth).toLocaleString("es-ES", { month: "long", year: "numeric" })}`}
        </p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={stats.monthlyTrend}>
            <CartesianGrid className="chart-grid" vertical={false} />
            <XAxis className="chart-axis" />
            <YAxis className="chart-axis" />
            <Tooltip contentClassName="chart-tooltip" />
            <Area
              type="monotone"
              dataKey="income"
              name="Ingresos"
              stroke="var(--success)"
              fill="var(--success)"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Gastos"
              stroke="var(--destructive)"
              fill="var(--destructive)"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
