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
      <Card className="p-4 md:p-6 border-2 border-primary/30 border-glow-cyan shadow-lg bg-card/80 backdrop-blur-sm">
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
    <Card className="p-4 md:p-6 border-2 border-primary/30 border-glow-cyan shadow-lg hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 pointer-events-none" />
      <div className="mb-6 relative z-10">
        <h3 className="text-base md:text-lg font-semibold mb-1 text-primary uppercase tracking-wide text-glow-cyan">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={280} className="md:h-[320px]">
          <AreaChart data={stats.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.75 0.25 195)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="oklch(0.75 0.25 195)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.28 325)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="oklch(0.72 0.28 325)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-primary/20" vertical={false} />
            <XAxis
              dataKey="month"
              className="text-xs"
              stroke="oklch(0.65 0.05 195)"
              tick={{ fill: "oklch(0.65 0.05 195)" }}
              axisLine={{ stroke: "oklch(0.35 0.15 195)" }}
              label={{
                value: statsView === "anual" ? "Mes" : "Día",
                position: "insideBottomRight",
                offset: -5,
                fill: "oklch(0.65 0.05 195)",
                fontSize: 12,
              }}
            />
            <YAxis
              className="text-xs"
              tickFormatter={(value) => `€${value}`}
              stroke="oklch(0.65 0.05 195)"
              tick={{ fill: "oklch(0.65 0.05 195)" }}
              axisLine={{ stroke: "oklch(0.35 0.15 195)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.15 0.02 265)",
                border: "2px solid oklch(0.75 0.25 195)",
                borderRadius: "8px",
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
              }}
              formatter={(value: number) => [formatCurrency(value), ""]}
              labelStyle={{ fontWeight: 600, marginBottom: "8px", color: "oklch(0.75 0.25 195)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "13px", paddingTop: "16px", color: "oklch(0.98 0.01 180)" }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Ingresos"
              stroke="oklch(0.75 0.25 195)"
              strokeWidth={3}
              fill="url(#incomeGradient)"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Gastos"
              stroke="oklch(0.72 0.28 325)"
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
