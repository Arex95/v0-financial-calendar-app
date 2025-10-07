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
      <Card className="p-4 md:p-6 border bg-card rounded-lg">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-primary uppercase tracking-wide">{title}</h3>
        <p className="text-muted-foreground text-center py-8 text-sm">No hay datos disponibles</p>
      </Card>
    )
  }

  return (
    <Card className="p-5 md:p-7 border bg-card rounded-lg">
      <div className="mb-6">
        <h3
          className={cn(
            "text-base md:text-lg font-semibold mb-1 uppercase tracking-wide",
            type === "income" ? "text-primary" : "text-secondary",
          )}
        >
          {title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          Total:{" "}
          <span className={cn("font-semibold", type === "income" ? "text-primary" : "text-secondary")}>
            {formatCurrency(total)}
          </span>
        </p>
      </div>
      <div className="space-y-5">
        {entries.map(([category, amount]) => {
          const percentage = (amount / total) * 100
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-2.5 gap-2">
                <span className="text-xs md:text-sm font-medium truncate text-foreground/90">{category}</span>
                <div className="flex items-baseline gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      "text-sm md:text-base font-bold",
                      type === "income" ? "text-primary" : "text-secondary",
                    )}
                  >
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{percentage.toFixed(0)}%</span>
                </div>
              </div>
              <Progress
                value={percentage}
                className="h-2.5 bg-muted/30 border border-border/30"
                indicatorClassName={cn(
                  "transition-all duration-500 rounded-full",
                  type === "income"
                    ? "bg-primary"
                    : "bg-secondary",
                )}
              />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
