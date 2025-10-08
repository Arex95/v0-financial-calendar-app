"use client"

import type { CalendarEvent } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatCurrency } from "@/lib/financial-utils"

interface UpcomingEventsProps {
  events: CalendarEvent[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const now = new Date()
  const upcomingEvents = events
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          {upcomingEvents.length > 0 ? (
            <div className="relative pl-6">
              <div className="absolute left-3 top-0 h-full w-px bg-border" />
              {upcomingEvents.map((event, index) => (
                <div key={event.id} className="relative mb-6">
                  <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-primary" />
                  <div className="ml-6">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{event.title}</span>
                      <Badge variant={event.type === "income" ? "default" : "destructive"}>
                        {event.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "PPP", { locale: es })}
                    </div>
                    {event.amount && (
                      <div className="text-sm font-semibold">
                        {formatCurrency(event.amount)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No upcoming payments.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
