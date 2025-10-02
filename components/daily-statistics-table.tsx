"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CalendarEvent } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"
import { cn } from "@/lib/utils"

interface DailyStatisticsTableProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

interface DailyStats {
  date: string
  income: number
  expenses: number
  balance: number
  transactions: CalendarEvent[]
}

export function DailyStatisticsTable({ events, onEventClick }: DailyStatisticsTableProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Agrupar eventos por día
  const getDailyStats = (): DailyStats[] => {
    const financialEvents = events.filter((e) => e.type === "income" || e.type === "expense")
    const dailyMap = new Map<string, DailyStats>()

    financialEvents.forEach((event) => {
      const dateKey = new Date(event.date).toISOString().split("T")[0]

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          income: 0,
          expenses: 0,
          balance: 0,
          transactions: [],
        })
      }

      const stats = dailyMap.get(dateKey)!
      stats.transactions.push(event)

      if (event.type === "income") {
        stats.income += event.amount || 0
      } else if (event.type === "expense") {
        stats.expenses += event.amount || 0
      }
      stats.balance = stats.income - stats.expenses
    })

    // Filtrar por mes actual y ordenar por fecha descendente
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    return Array.from(dailyMap.values())
      .filter((stats) => {
        const date = new Date(stats.date)
        return date >= monthStart && date <= monthEnd
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const dailyStats = getDailyStats()

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg md:text-xl font-semibold">Estadísticas diarias</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="h-8 w-8 md:h-9 md:w-9 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm md:text-base font-medium capitalize min-w-[140px] md:min-w-[180px] text-center">
            {monthName}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 md:h-9 md:w-9 bg-transparent">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {dailyStats.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No hay transacciones en este mes</p>
      ) : (
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] md:w-[140px]">Fecha</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Gastos</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Trans.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyStats.map((stats) => (
                  <TableRow
                    key={stats.date}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => stats.transactions.length === 1 && onEventClick(stats.transactions[0])}
                  >
                    <TableCell className="font-medium text-xs md:text-sm">
                      {new Date(stats.date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell className="text-right text-xs md:text-sm">
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {stats.income > 0 ? formatCurrency(stats.income) : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs md:text-sm">
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        {stats.expenses > 0 ? formatCurrency(stats.expenses) : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs md:text-sm">
                      <span
                        className={cn(
                          "font-bold",
                          stats.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                        )}
                      >
                        {formatCurrency(stats.balance)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-xs md:text-sm hidden sm:table-cell">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {stats.transactions.length}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </Card>
  )
}
