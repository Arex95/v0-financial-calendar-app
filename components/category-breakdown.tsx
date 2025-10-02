"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/financial-utils"

interface CategoryBreakdownProps {
  title: string
  categories: Record<string, number>
  type: "income" | "expense"
}

export function CategoryBreakdown({ title, categories, type }: CategoryBreakdownProps) {
  const entries = Object.entries(categories).sort(([, a], [, b]) => b - a)
  const total = entries.reduce((sum, [, amount]) => sum + amount, 0)

  if (entries.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-muted-foreground text-center py-8">No hay datos disponibles</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {entries.map(([category, amount]) => {
          const percentage = (amount / total) * 100
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{category}</span>
                <span
                  className={`text-sm font-bold ${
                    type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={percentage}
                  className="flex-1"
                  indicatorClassName={type === "income" ? "bg-green-500" : "bg-red-500"}
                />
                <span className="text-xs text-muted-foreground w-12 text-right">{percentage.toFixed(1)}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
