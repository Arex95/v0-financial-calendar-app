'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/financial-utils'

import { CategoryIcon } from './category-icon';

interface CategoryBreakdownProps {
  title: string
  categories: Record<string, number>
  type: 'income' | 'expense'
}

export function CategoryBreakdown({ title, categories, type }: CategoryBreakdownProps) {
  const entries = Object.entries(categories).sort(([, a], [, b]) => b - a)
  const total = entries.reduce((sum, [, amount]) => sum + amount, 0)

  if (entries.length === 0) {
    return (
      <Card>
        <h3 className="category-breakdown-title">{title}</h3>
        <p className="text-muted-foreground text-center p-8">No data available</p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="mb-6">
        <h3 className={`category-breakdown-title text-${type === 'income' ? 'green' : 'red'}-500`}>{title}</h3>
        <p className="text-sm text-muted-foreground">
          Total: <span className={`font-semibold text-${type === 'income' ? 'green' : 'red'}-500`}>
            {formatCurrency(total)}
          </span>
        </p>
      </div>
      <div>
        {entries.map(([category, amount]) => {
          const percentage = (amount / total) * 100
          return (
            <div key={category} className="category-breakdown-item">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <CategoryIcon category={category} className="w-5 h-5" />
                  <span className="text-sm font-medium text-left">{category}</span>
                </div>
                <span className={`font-bold text-${type === 'income' ? 'green' : 'red'}-500`}>
                  {formatCurrency(amount)}
                </span>
              </div>
              <Progress value={percentage} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}