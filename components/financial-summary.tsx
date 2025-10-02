"use client"

import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { FinancialStats } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"

interface FinancialSummaryProps {
  stats: FinancialStats
}

export function FinancialSummary({ stats }: FinancialSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ingresos totales</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(stats.totalIncome)}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Gastos totales</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(stats.totalExpenses)}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Balance</p>
            <p
              className={`text-2xl font-bold ${
                stats.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(stats.balance)}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>
    </div>
  )
}
