"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CalendarEvent } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"

interface DailyStatisticsTableProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function DailyStatisticsTable({ events, onEventClick }: DailyStatisticsTableProps) {
  // Agrupa eventos por día
  const grouped = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const date = new Date(event.date).toLocaleDateString("es-ES")
    acc[date] = acc[date] || []
    acc[date].push(event)
    return acc
  }, {})

  const days = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <Card className="card-base">
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--primary)" }}>Estadísticas diarias</h3>
      </div>
      {days.length === 0 ? (
        <p style={{ color: "var(--muted-foreground)", textAlign: "center", padding: "2rem 0", fontSize: "0.95rem" }}>
          No hay transacciones en este mes
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ color: "var(--muted-foreground)" }}>Día</TableHead>
                <TableHead style={{ color: "var(--muted-foreground)" }}>Ingresos</TableHead>
                <TableHead style={{ color: "var(--muted-foreground)" }}>Gastos</TableHead>
                <TableHead style={{ color: "var(--muted-foreground)" }}>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((date) => {
                const dayEvents = grouped[date]
                const income = dayEvents.filter((e) => e.type === "income").reduce((sum, e) => sum + (e.amount || 0), 0)
                const expense = dayEvents.filter((e) => e.type === "expense").reduce((sum, e) => sum + (e.amount || 0), 0)
                const balance = income - expense
                return (
                  <TableRow key={date}>
                    <TableCell style={{ fontWeight: 600 }}>{date}</TableCell>
                    <TableCell style={{ color: "var(--success)", fontWeight: 600 }}>{formatCurrency(income)}</TableCell>
                    <TableCell style={{ color: "var(--destructive)", fontWeight: 600 }}>{formatCurrency(expense)}</TableCell>
                    <TableCell
                      style={{
                        color: balance >= 0 ? "var(--success)" : "var(--destructive)",
                        fontWeight: 700,
                      }}
                    >
                      {formatCurrency(balance)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
