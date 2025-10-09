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

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const chartData = stats.monthlyTrend.map((item, index) => {
    const itemDate = statsView === 'annual'
      ? new Date(selectedYear, index)
      : new Date(selectedYear, selectedMonth, parseInt(item.month));

    const isFuture = itemDate > today;

    return {
      ...item,
      pastIncome: !isFuture ? item.income : null,
      futureIncome: isFuture ? item.income : null,
      pastExpenses: !isFuture ? item.expenses : null,
      futureExpenses: isFuture ? item.expenses : null,
    };
  });

  // Connect the lines
  const lastPastIndex = chartData.findIndex(d => d.futureIncome !== null || d.futureExpenses !== null);
  if (lastPastIndex > 0) {
    chartData[lastPastIndex] = {
      ...chartData[lastPastIndex],
      pastIncome: chartData[lastPastIndex - 1].pastIncome,
      pastExpenses: chartData[lastPastIndex - 1].pastExpenses,
    };
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
          <AreaChart data={chartData}>
            <CartesianGrid className="chart-grid" vertical={false} />
            <XAxis dataKey="month" className="chart-axis" />
            <YAxis className="chart-axis" />
            <Tooltip contentClassName="chart-tooltip" />
            <Area
              type="monotone"
              dataKey="pastIncome"
              name="Income"
              stroke="var(--chart-line-income)"
              fill="var(--chart-area-income)"
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="futureIncome"
              name="Future Income"
              stroke="var(--chart-line-income)"
              fill="var(--chart-area-income)"
              strokeDasharray="5 5"
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="pastExpenses"
              name="Expenses"
              stroke="var(--chart-line-expense)"
              fill="var(--chart-area-expense)"
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="futureExpenses"
              name="Future Expenses"
              stroke="var(--chart-line-expense)"
              fill="var(--chart-area-expense)"
              strokeDasharray="5 5"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}