"use client"

import { useState, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Calendar, DollarSign } from "lucide-react"

interface Expense {
  id: string
  date: string
  amount: number
  category: string
  entityId?: string
  type: "entity" | "personal"
}

interface ExpensesChartProps {
  expenses: Expense[]
  className?: string
}

type Granularity = "day" | "month" | "year"

export default function ExpensesChart({ expenses, className }: ExpensesChartProps) {
  const [granularity, setGranularity] = useState<Granularity>("day")
  const [chartType, setChartType] = useState<"line" | "bar">("line")

  const { chartData, stats } = useMemo(() => {
    if (!expenses.length) return { chartData: [], stats: null }

    const groupedData: Record<string, number> = {}
    let maxAmount = 0
    let maxDate = ""

    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      let key = ""

      if (granularity === "day") {
        key = date.toLocaleDateString()
      } else if (granularity === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      } else {
        key = `${date.getFullYear()}`
      }

      groupedData[key] = (groupedData[key] || 0) + expense.amount
    })

    const data = Object.entries(groupedData)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => {
        if (granularity === "day") return new Date(a.name).getTime() - new Date(b.name).getTime()
        return a.name.localeCompare(b.name)
      })

    // Calculate stats
    let maxDayAmount = 0
    let maxDayDate = ""
    let maxMonthAmount = 0
    let maxMonthDate = ""
    let maxYearAmount = 0
    let maxYearDate = ""

    const dayGroups: Record<string, number> = {}
    const monthGroups: Record<string, number> = {}
    const yearGroups: Record<string, number> = {}

    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const dayKey = date.toLocaleDateString()
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const yearKey = `${date.getFullYear()}`

      dayGroups[dayKey] = (dayGroups[dayKey] || 0) + expense.amount
      monthGroups[monthKey] = (monthGroups[monthKey] || 0) + expense.amount
      yearGroups[yearKey] = (yearGroups[yearKey] || 0) + expense.amount
    })

    Object.entries(dayGroups).forEach(([date, amount]) => {
      if (amount > maxDayAmount) {
        maxDayAmount = amount
        maxDayDate = date
      }
    })

    Object.entries(monthGroups).forEach(([date, amount]) => {
      if (amount > maxMonthAmount) {
        maxMonthAmount = amount
        maxMonthDate = date
      }
    })

    Object.entries(yearGroups).forEach(([date, amount]) => {
      if (amount > maxYearAmount) {
        maxYearAmount = amount
        maxYearDate = date
      }
    })

    return {
      chartData: data,
      stats: {
        maxDay: { date: maxDayDate, amount: maxDayAmount },
        maxMonth: { date: maxMonthDate, amount: maxMonthAmount },
        maxYear: { date: maxYearDate, amount: maxYearAmount },
      },
    }
  }, [expenses, granularity])

  return (
    <div
      className={cn(
        "w-full bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-base sm:text-lg font-bold text-card-foreground">Expenses Trend</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            {(["day", "month", "year"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize",
                  granularity === g
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            {(["line", "bar"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize",
                  chartType === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto mb-6">
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-50" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="amount"
                name="Expenses"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-50" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                  fontSize: "12px",
                }}
                cursor={{ fill: "hsl(var(--muted)/0.2)" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
              <Bar dataKey="amount" name="Expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-6">
          <Card className="bg-muted/50 border-0 shadow-none">
            <CardContent className="p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                <Calendar className="w-3 h-3" />
                Highest Day
              </div>
              <div className="text-lg font-bold text-foreground">
                {stats.maxDay.date || "N/A"}
              </div>
              <div className="text-sm font-medium text-primary">
                ${stats.maxDay.amount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-0 shadow-none">
            <CardContent className="p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                <TrendingUp className="w-3 h-3" />
                Highest Month
              </div>
              <div className="text-lg font-bold text-foreground">
                {stats.maxMonth.date || "N/A"}
              </div>
              <div className="text-sm font-medium text-primary">
                ${stats.maxMonth.amount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-0 shadow-none">
            <CardContent className="p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                <DollarSign className="w-3 h-3" />
                Highest Year
              </div>
              <div className="text-lg font-bold text-foreground">
                {stats.maxYear.date || "N/A"}
              </div>
              <div className="text-sm font-medium text-primary">
                ${stats.maxYear.amount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
