"use client"

import { Card } from "@/components/ui/card"
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
      <Card className="p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4">Transacciones recientes</h3>
        <p className="text-muted-foreground text-center py-8 text-sm">No hay transacciones registradas</p>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold mb-4">Transacciones recientes</h3>
      <div className="space-y-3">
        {financialEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick(event)}
            className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors border border-border gap-2"
          >
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  event.type === "income" && "bg-green-500",
                  event.type === "expense" && "bg-red-500",
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm md:text-base">{event.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(event.date).toLocaleDateString("es-ES")}</span>
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
                "font-bold text-base md:text-lg flex-shrink-0",
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
