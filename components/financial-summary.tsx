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
      <Card className="p-5 md:p-7 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Ingresos totales</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 truncate tracking-tight">
              {formatCurrency(stats.totalIncome)}
            </p>
          </div>
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center flex-shrink-0 ml-3 shadow-sm">
            <TrendingUp className="h-6 w-6 md:h-7 md:w-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>

      <Card className="p-5 md:p-7 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Gastos totales</p>
            <p className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 truncate tracking-tight">
              {formatCurrency(stats.totalExpenses)}
            </p>
          </div>
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center flex-shrink-0 ml-3 shadow-sm">
            <TrendingDown className="h-6 w-6 md:h-7 md:w-7 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </Card>

      <Card className="p-5 md:p-7 sm:col-span-2 lg:col-span-1 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-2 font-medium">Balance</p>
            <p
              className={cn(
                "text-2xl md:text-3xl font-bold truncate tracking-tight",
                stats.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {formatCurrency(stats.balance)}
            </p>
          </div>
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center flex-shrink-0 ml-3 shadow-sm">
            <Wallet className="h-6 w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>
    </div>
  )
}
