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
      <Card className="p-4 md:p-6 border-2 border-primary/30 border-glow-cyan shadow-lg bg-card/80 backdrop-blur-sm">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-primary uppercase tracking-wide">
          Transacciones recientes
        </h3>
        <p className="text-muted-foreground text-center py-8 text-sm">No hay transacciones registradas</p>
      </Card>
    )
  }

  return (
    <Card className="p-5 md:p-7 border-2 border-primary/30 border-glow-cyan shadow-lg hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
      <div className="mb-6 relative z-10">
        <h3 className="text-base md:text-lg font-semibold mb-1 text-primary uppercase tracking-wide text-glow-cyan">
          Transacciones recientes
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">Últimas {financialEvents.length} transacciones</p>
      </div>
      <div className="space-y-2 relative z-10">
        {financialEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick(event)}
            className={cn(
              "flex items-center justify-between p-3 md:p-4 rounded-lg cursor-pointer transition-all duration-200 gap-3 group/item border-2",
              event.type === "income"
                ? "hover:bg-primary/10 border-transparent hover:border-primary/50 hover:glow-cyan"
                : "hover:bg-secondary/10 border-transparent hover:border-secondary/50 hover:glow-magenta",
            )}
          >
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <div
                className={cn(
                  "w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover/item:scale-110 border-2",
                  event.type === "income" && "bg-primary/20 text-primary border-primary",
                  event.type === "expense" && "bg-secondary/20 text-secondary border-secondary",
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
                event.type === "income" && "text-primary",
                event.type === "expense" && "text-secondary",
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
