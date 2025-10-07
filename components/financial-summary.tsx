"use client"

import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { FinancialStats } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"
import { cn } from "@/lib/utils"

interface FinancialSummaryProps {
  stats: FinancialStats
}

export function FinancialSummary({ stats }: FinancialSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <Card className="p-5 md:p-7 border bg-card rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-primary mb-2 font-semibold uppercase tracking-wider">
              Ingresos totales
            </p>
            <p className="text-2xl md:text-3xl font-bold text-primary truncate tracking-tight">
              {formatCurrency(stats.totalIncome)}
            </p>
          </div>
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-lg bg-primary/10 border-2 border-primary flex items-center justify-center flex-shrink-0 ml-3">
            <TrendingUp className="h-6 w-6 md:h-7 md:w-7 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-5 md:p-7 border bg-card rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-secondary mb-2 font-semibold uppercase tracking-wider">
              Gastos totales
            </p>
            <p className="text-2xl md:text-3xl font-bold text-secondary truncate tracking-tight">
              {formatCurrency(stats.totalExpenses)}
            </p>
          </div>
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-lg bg-secondary/10 border-2 border-secondary flex items-center justify-center flex-shrink-0 ml-3">
            <TrendingDown className="h-6 w-6 md:h-7 md:w-7 text-secondary" />
          </div>
        </div>
      </Card>

      <Card className="p-5 md:p-7 sm:col-span-2 lg:col-span-1 border bg-card rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-accent mb-2 font-semibold uppercase tracking-wider">Balance</p>
            <p
              className={cn(
                "text-2xl md:text-3xl font-bold truncate tracking-tight",
                stats.balance >= 0 ? "text-primary" : "text-secondary",
              )}
            >
              {formatCurrency(stats.balance)}
            </p>
          </div>
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-lg bg-accent/10 border-2 border-accent flex items-center justify-center flex-shrink-0 ml-3">
            <Wallet className="h-6 w-6 md:h-7 md:w-7 text-accent" />
          </div>
        </div>
      </Card>
    </div>
  )
}
