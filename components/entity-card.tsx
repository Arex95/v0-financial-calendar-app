"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { MoreVertical, TrendingUp, TrendingDown, DollarSign, Home, Car, User, Building2, HelpCircle, Eye, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Entity } from "@/lib/local-storage"

interface EntityCardProps {
  entity: Entity
  onClick?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onViewDetails?: () => void
  className?: string
  globalTotalIncome?: number
  globalTotalExpenses?: number
}

export default function EntityCard({
  entity,
  onClick,
  onDelete,
  onEdit,
  onViewDetails,
  className,
  globalTotalIncome = 0,
  globalTotalExpenses = 0
}: EntityCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getIcon = (type: Entity["type"]) => {
    switch (type) {
      case "House":
        return Home
      case "Car":
        return Car
      case "Person":
        return User
      case "Business":
        return Building2
      default:
        return HelpCircle
    }
  }

  const Icon = getIcon(entity.type)

  // Calculate percentages
  const incomePercentage = globalTotalIncome > 0
    ? (entity.totalIncome / globalTotalIncome) * 100
    : 0
  const expensePercentage = globalTotalExpenses > 0
    ? (entity.totalExpenses / globalTotalExpenses) * 100
    : 0

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/20",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon className="w-4 h-4" />
          </div>
          {entity.name}
        </CardTitle>
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {onViewDetails && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMenuOpen(false)
                  onViewDetails()
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalles
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMenuOpen(false)
                  onEdit()
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMenuOpen(false)
                  onDelete()
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {/* Income/Expense Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Ingresos</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {entity.currency} {entity.totalIncome.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Gastos</div>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              {entity.currency} {entity.totalExpenses.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Percentage Bars */}
        <div className="space-y-3 mb-4">
          {/* Income Percentage Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                % Ingresos Globales
              </div>
              <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                {incomePercentage.toFixed(1)}%
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 dark:bg-green-400 transition-all duration-500"
                style={{ width: `${Math.min(incomePercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Expense Percentage Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                % Gastos Globales
              </div>
              <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                {expensePercentage.toFixed(1)}%
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 dark:bg-red-400 transition-all duration-500"
                style={{ width: `${Math.min(expensePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3" />
              Transacciones
            </div>
            <div className="text-sm font-semibold">{entity.events?.length || 0}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
              <DollarSign className="w-3 h-3" />
              Promedio
            </div>
            <div className="text-sm font-semibold">
              {entity.currency} {(entity.totalExpenses / (entity.events?.length || 1)).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
