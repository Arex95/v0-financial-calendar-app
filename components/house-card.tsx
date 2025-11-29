"use client"

import { cn } from "@/lib/utils"
import { MoreVertical, TrendingUp, DollarSign, Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HouseCardProps {
  name: string
  totalExpenses: number
  expenseCount: number
  currency: string
  onClick?: () => void
  onDelete?: () => void
  className?: string
}

export default function HouseCard({
  name,
  totalExpenses,
  expenseCount,
  currency,
  onClick,
  onDelete,
  className,
}: HouseCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/20",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Home className="w-4 h-4" />
          </div>
          {name}
        </CardTitle>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currency} {totalExpenses.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Total Expenses
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3" />
              Transactions
            </div>
            <div className="text-sm font-semibold">{expenseCount}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
              <DollarSign className="w-3 h-3" />
              Average
            </div>
            <div className="text-sm font-semibold">
              {currency} {(totalExpenses / (expenseCount || 1)).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
