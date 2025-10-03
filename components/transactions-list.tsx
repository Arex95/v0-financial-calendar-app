"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { CalendarEvent } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"
import { cn } from "@/lib/utils"

interface TransactionsListProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function TransactionsList({ events, onEventClick }: TransactionsListProps) {
  const financialEvents = events
    .filter((e) => e.type === "income" || e.type === "expense")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  if (financialEvents.length === 0) {
    return (
      <Card className="p-4 md:p-6 border-border/50 shadow-lg">
        <h3 className="text-base md:text-lg font-semibold mb-4">Transacciones recientes</h3>
        <p className="text-muted-foreground text-center py-8 text-sm">No hay transacciones registradas</p>
      </Card>
    )
  }

  return (
    <Card className="p-5 md:p-7 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-1">Transacciones recientes</h3>
        <p className="text-xs md:text-sm text-muted-foreground">Últimas {financialEvents.length} transacciones</p>
      </div>
      <div className="space-y-2">
        {financialEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick(event)}
            className="flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-accent/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-border/50 gap-3 group"
          >
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <div
                className={cn(
                  "w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                  event.type === "income" && "bg-green-500/15 text-green-600 dark:text-green-400",
                  event.type === "expense" && "bg-red-500/15 text-red-600 dark:text-red-400",
                )}
              >
                {event.type === "income" ? (
                  <ArrowUpRight className="h-5 w-5" />
                ) : (
                  <ArrowDownRight className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-sm md:text-base">{event.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span>{new Date(event.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>
                  {event.category && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline truncate">{event.category}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              className={cn(
                "font-bold text-base md:text-lg flex-shrink-0 tabular-nums",
                event.type === "income" && "text-green-600 dark:text-green-400",
                event.type === "expense" && "text-red-600 dark:text-red-400",
              )}
            >
              {event.type === "income" ? "+" : "-"}
              {formatCurrency(event.amount || 0)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
