'use client'

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { FinancialStats } from '@/lib/types'
import { formatCurrency } from '@/lib/financial-utils'

interface FinancialSummaryProps {
  stats: FinancialStats
}

export function FinancialSummary({ stats }: FinancialSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <div className="summary-card">
          <div>
            <p className="summary-card-title">Total Income</p>
            <p className="summary-card-amount text-green-500">
              {formatCurrency(stats.totalIncome)}
            </p>
          </div>
          <div className="summary-card-icon bg-green-100">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </Card>
      <Card>
        <div className="summary-card">
          <div>
            <p className="summary-card-title">Total Expenses</p>
            <p className="summary-card-amount text-red-500">
              {formatCurrency(stats.totalExpenses)}
            </p>
          </div>
          <div className="summary-card-icon bg-red-100">
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
        </div>
      </Card>
      <Card>
        <div className="summary-card">
          <div>
            <p className="summary-card-title">Balance</p>
            <p className={`summary-card-amount ${stats.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(stats.balance)}
            </p>
          </div>
          <div className="summary-card-icon bg-blue-100">
            <Wallet className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </Card>
    </div>
  )
}