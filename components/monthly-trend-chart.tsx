'use client'

import { Card } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { FinancialStats } from '@/lib/types'

interface MonthlyTrendChartProps {
  stats: FinancialStats
  statsView?: 'monthly' | 'annual'
  selectedMonth?: number
  selectedYear?: number
}

export function MonthlyTrendChart({ stats, statsView = 'monthly', selectedMonth, selectedYear }: MonthlyTrendChartProps) {
  if (stats.monthlyTrend.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
        <p className="text-muted-foreground text-center py-8">Not enough data to show trend</p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">
          {statsView === 'annual' ? 'Annual Trend' : 'Monthly Trend'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {statsView === 'annual' ? `Year ${selectedYear}` : 
           `${new Date(selectedYear, selectedMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`}
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
              name="Income"
              stroke="var(--chart-line-income)"
              fill="var(--chart-area-income)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="var(--chart-line-expense)"
              fill="var(--chart-area-expense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}