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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Ingresos totales</p>
            <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 truncate">
              {formatCurrency(stats.totalIncome)}
            </p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 ml-2">
            <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Gastos totales</p>
            <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 truncate">
              {formatCurrency(stats.totalExpenses)}
            </p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 ml-2">
            <TrendingDown className="h-5 w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Balance</p>
            <p
              className={cn(
                "text-xl md:text-2xl font-bold truncate",
                stats.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {formatCurrency(stats.balance)}
            </p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 ml-2">
            <Wallet className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>
    </div>
  )
}
