"use client"

import { TrendingUp, DollarSign, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardStatsProps {
  totalExpenses: number
  totalHouses: number
  averagePerHouse: number
  lastSyncDate?: string
  className?: string
}

export default function DashboardStats({
  totalExpenses,
  totalHouses,
  averagePerHouse,
  lastSyncDate,
  className,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Houses",
      value: totalHouses.toString(),
      icon: Home,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Average",
      value: `$${averagePerHouse.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className={cn("w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4", className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-white dark:bg-[#0F0F12] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-[#1F1F23] hover:border-gray-300 dark:hover:border-[#2B2B30] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{stat.value}</p>
              </div>
              <div className={cn("p-2 sm:p-2.5 rounded-lg flex-shrink-0", stat.color)}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
