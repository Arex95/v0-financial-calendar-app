"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { MoreVertical, TrendingUp, DollarSign, Home, Car, User, Building2, HelpCircle, Eye, Edit, Trash2 } from "lucide-react"
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
}

export default function EntityCard({ entity, onClick, onDelete, onEdit, onViewDetails, className }: EntityCardProps) {
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
        <div className="text-2xl font-bold">
          {entity.currency} {entity.totalExpenses.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Total Expenses</p>

        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3" />
              Transactions
            </div>
            <div className="text-sm font-semibold">{entity.events?.length || 0}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
              <DollarSign className="w-3 h-3" />
              Average
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
