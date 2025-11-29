"use client"

import { Home, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatsProps {
  totalExpenses: number
  totalHouses: number
  averagePerHouse: number
  personalExpenses?: number
  lastSyncDate?: string
  className?: string
}

export default function DashboardStats({
  totalExpenses,
  totalHouses,
  averagePerHouse,
  personalExpenses = 0,
  lastSyncDate,
  className,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "House Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: Home,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Personal Expenses",
      value: `$${personalExpenses.toFixed(2)}`,
      icon: User,
      color: "text-secondary bg-secondary/10",
    },
    {
      label: "Houses",
      value: totalHouses.toString(),
      icon: Home,
      color: "text-accent-foreground bg-accent/20",
    },
  ]

  return (
    <div className={cn("w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4", className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={cn("p-3 rounded-xl", stat.color)}>
                <Icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
