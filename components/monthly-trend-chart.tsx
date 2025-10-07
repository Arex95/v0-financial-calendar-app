"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
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
      <Card className="p-5 md:p-7 border bg-card rounded-lg">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-primary uppercase tracking-wide">
          {statsView === "anual" ? "Tendencia anual" : "Tendencia mensual"}
        </h3>
        <p className="text-muted-foreground text-center py-8 text-sm">
          No hay datos suficientes para mostrar la tendencia
        </p>
      </Card>
    )
  }

  // Título y subtítulo dinámico
  let title = statsView === "anual" ? "Tendencia anual" : "Tendencia mensual"
  let subtitle = ""
  if (statsView === "anual" && selectedYear !== undefined) {
    subtitle = `Año ${selectedYear}`
  } else if (statsView === "mensual" && selectedMonth !== undefined && selectedYear !== undefined) {
    subtitle = `${new Date(selectedYear, selectedMonth).toLocaleString("es-ES", { month: "long", year: "numeric" })}`
  }

  return (
    <Card className="p-5 md:p-7 border bg-card rounded-lg">
      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-1 text-primary uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={280} className="md:h-[320px]">
          <AreaChart data={stats.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-primary/20" vertical={false} />
            <XAxis
              dataKey="month"
              className="text-xs"
              stroke="var(--primary)"
              tick={{ fill: "var(--primary)" }}
              axisLine={{ stroke: "var(--primary)" }}
              label={{
                value: statsView === "anual" ? "Mes" : "Día",
                position: "insideBottomRight",
                offset: -5,
                fill: "var(--primary)",
                fontSize: 12,
              }}
            />
            <YAxis
              className="text-xs"
              tickFormatter={(value) => `€${value}`}
              stroke="var(--primary)"
              tick={{ fill: "var(--primary)" }}
              axisLine={{ stroke: "var(--primary)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "2px solid var(--primary)",
                borderRadius: "8px",
                boxShadow: "0 0 20px rgba(0, 85, 164, 0.1)",
              }}
              formatter={(value: number) => [formatCurrency(value), ""]}
              labelStyle={{ fontWeight: 600, marginBottom: "8px", color: "var(--primary)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "13px", paddingTop: "16px", color: "var(--foreground)" }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Ingresos"
              stroke="var(--primary)"
              strokeWidth={3}
              fill="url(#incomeGradient)"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Gastos"
              stroke="var(--accent)"
              strokeWidth={3}
              fill="url(#expensesGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
