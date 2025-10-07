"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { CalendarEvent } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"

interface TransactionsListProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function TransactionsList({ events, onEventClick }: TransactionsListProps) {
  const financialEvents = events
    .filter((e) => e.type === "income" || e.type === "expense")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <Card className="card-base">
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--primary)" }}>Transacciones recientes</h3>
      </div>
      {financialEvents.length > 0 ? (
        <div>
          {financialEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                marginBottom: "0.5rem",
                background: "transparent",
                transition: "background 0.2s"
              }}
              onMouseOver={e => (e.currentTarget.style.background = "var(--muted)")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  height: "2.5rem",
                  width: "2.5rem",
                  borderRadius: "var(--radius)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: event.type === "income"
                    ? "color-mix(in srgb, var(--success) 10%, transparent)"
                    : "color-mix(in srgb, var(--destructive) 10%, transparent)",
                  color: event.type === "income" ? "var(--success)" : "var(--destructive)"
                }}>
                  {event.type === "income"
                    ? <ArrowUpRight style={{ width: "1.25rem", height: "1.25rem" }} />
                    : <ArrowDownRight style={{ width: "1.25rem", height: "1.25rem" }} />}
                </div>
                <div>
                  <p style={{ fontWeight: 600 }}>{event.title}</p>
                  <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
                    {new Date(event.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                  </p>
                </div>
              </div>
              <p style={{
                fontWeight: 700,
                color: event.type === "income" ? "var(--success)" : "var(--destructive)"
              }}>
                {event.type === "income" ? "+" : "-"}
                {formatCurrency(event.amount || 0)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--muted-foreground)", textAlign: "center", padding: "2rem 0", fontSize: "0.95rem" }}>
          No hay transacciones recientes.
        </p>
      )}
    </Card>
  )
}
