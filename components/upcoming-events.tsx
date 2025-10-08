"use client"

import type { CalendarEvent } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { es } from "date-fns/locale"

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
        <CardTitle>Próximos Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <div className="flex flex-col">
                    <span className="font-semibold">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "PPP", { locale: es })}
                    </span>
                  </div>
                  <Badge variant={event.type === "income" ? "default" : "destructive"}>
                    {event.type === "income" ? "Ingreso" : "Gasto"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No hay próximos eventos.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
