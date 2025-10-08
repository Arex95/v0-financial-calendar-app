'use client'

import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CalendarEvent } from '@/lib/types'
import { formatCurrency } from '@/lib/financial-utils'

interface DailyStatisticsTableProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function DailyStatisticsTable({ events, onEventClick }: DailyStatisticsTableProps) {
  // Agrupa eventos por día
  const grouped = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const date = new Date(event.date).toLocaleDateString('en-US')
    acc[date] = acc[date] || []
    acc[date].push(event)
    return acc
  }, {})

  const days = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Daily Statistics</h3>
      </div>
      {days.length === 0 ? (
        <p className="text-muted-foreground text-center p-8">No transactions this month</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((date) => {
                const dayEvents = grouped[date]
                const income = dayEvents.filter((e) => e.type === 'income').reduce((sum, e) => sum + (e.amount || 0), 0)
                const expense = dayEvents.filter((e) => e.type === 'expense').reduce((sum, e) => sum + (e.amount || 0), 0)
                const balance = income - expense
                return (
                  <TableRow key={date}>
                    <TableCell className="font-semibold">{date}</TableCell>
                    <TableCell className="text-green-500 font-semibold">{formatCurrency(income)}</TableCell>
                    <TableCell className="text-red-500 font-semibold">{formatCurrency(expense)}</TableCell>
                    <TableCell className={`${balance >= 0 ? 'text-green-500' : 'text-red-500'} font-bold`}>
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