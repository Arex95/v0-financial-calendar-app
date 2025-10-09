'use client'

import { Card } from '@/components/ui/card'
import { CategoryIcon } from './category-icon';

interface TransactionsListProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function TransactionsList({ events, onEventClick }: TransactionsListProps) {
  const financialEvents = events
    .filter((e) => e.type === 'income' || e.type === 'expense')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
      </div>
      {financialEvents.length > 0 ? (
        <div>
          {financialEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="transaction-list-item"
            >
              <div className="flex items-center gap-4">
                <div className={`summary-card-icon bg-${event.type === 'income' ? 'green' : 'red'}-100`}>
                  <CategoryIcon category={event.category} className={`h-5 w-5 text-${event.type === 'income' ? 'green' : 'red'}-500`} />
                </div>
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
              <p className={`font-bold text-${event.type === 'income' ? 'green' : 'red'}-500`}>
                {event.type === 'income' ? '+' : '-'}
                {formatCurrency(event.amount || 0)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center p-8">No recent transactions.</p>
      )}
    </Card>
  )
}