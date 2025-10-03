"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { FinancialStats } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"

interface MonthlyTrendChartProps {
  stats: FinancialStats
}

export function MonthlyTrendChart({ stats }: MonthlyTrendChartProps) {
  if (stats.monthlyTrend.length === 0) {
    return (
      <Card className="p-4 md:p-6 border-border/50 shadow-lg">
        <h3 className="text-base md:text-lg font-semibold mb-4">Tendencia mensual</h3>
        <p className="text-muted-foreground text-center py-8 text-sm">
          No hay datos suficientes para mostrar la tendencia
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-6 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-1">Tendencia mensual</h3>
        <p className="text-xs md:text-sm text-muted-foreground">Últimos 6 meses de actividad financiera</p>
      </div>
      <ResponsiveContainer width="100%" height={280} className="md:h-[320px]">
        <AreaChart data={stats.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(0 84% 60%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
          <XAxis
            dataKey="month"
            className="text-xs"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            className="text-xs"
            tickFormatter={(value) => `€${value}`}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            formatter={(value: number) => [formatCurrency(value), ""]}
            labelStyle={{ fontWeight: 600, marginBottom: "8px" }}
          />
          <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }} iconType="circle" />
          <Area
            type="monotone"
            dataKey="income"
            name="Ingresos"
            stroke="hsl(142 76% 36%)"
            strokeWidth={2.5}
            fill="url(#incomeGradient)"
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Gastos"
            stroke="hsl(0 84% 60%)"
            strokeWidth={2.5}
            fill="url(#expensesGradient)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
