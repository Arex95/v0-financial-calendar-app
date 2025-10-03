"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/financial-utils"
import { cn } from "@/lib/utils"

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
      <Card className="p-4 md:p-6 border-border/50 shadow-lg">
        <h3 className="text-base md:text-lg font-semibold mb-4">{title}</h3>
        <p className="text-muted-foreground text-center py-8 text-sm">No hay datos disponibles</p>
      </Card>
    )
  }

  return (
    <Card className="p-5 md:p-7 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-1">{title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          Total: <span className="font-semibold">{formatCurrency(total)}</span>
        </p>
      </div>
      <div className="space-y-5">
        {entries.map(([category, amount]) => {
          const percentage = (amount / total) * 100
          return (
            <div key={category} className="group">
              <div className="flex items-center justify-between mb-2.5 gap-2">
                <span className="text-xs md:text-sm font-medium truncate text-foreground/90">{category}</span>
                <div className="flex items-baseline gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      "text-sm md:text-base font-bold",
                      type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{percentage.toFixed(0)}%</span>
                </div>
              </div>
              <Progress
                value={percentage}
                className="h-2.5 bg-muted/50"
                indicatorClassName={cn(
                  "transition-all duration-500 rounded-full",
                  type === "income"
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : "bg-gradient-to-r from-red-500 to-red-600",
                )}
              />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
