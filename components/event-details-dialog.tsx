"use client"

import { Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { CalendarEvent } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"
import { cn } from "@/lib/utils"

interface EventDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: CalendarEvent | null
  onEdit: (event: CalendarEvent) => void
  onDelete: (id: string) => void
}

export function EventDetailsDialog({ open, onOpenChange, event, onEdit, onDelete }: EventDetailsDialogProps) {
  if (!event) return null

  const eventDate = new Date(event.date)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className={cn(
                "w-3 h-3 rounded-full",
                event.type === "income" && "bg-green-500",
                event.type === "expense" && "bg-red-500",
                event.type === "normal" && "bg-blue-500",
              )}
            />
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-[var(--muted-foreground)] mb-1">Fecha</p>
            <p className="font-medium">
              {eventDate.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--muted-foreground)] mb-1">Tipo</p>
            <p className="font-medium capitalize">
              {event.type === "income" && "Ingreso"}
              {event.type === "expense" && "Gasto"}
              {event.type === "normal" && "Evento normal"}
            </p>
          </div>

          {event.description && (
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Descripción</p>
              <p className="text-sm">{event.description}</p>
            </div>
          )}

          {event.type !== "normal" && (
            <>
              {event.amount && (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Monto</p>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      event.type === "income" && "text-green-600 dark:text-green-400",
                      event.type === "expense" && "text-red-600 dark:text-red-400",
                    )}
                  >
                    {event.type === "income" ? "+" : "-"}
                    {formatCurrency(event.amount)}
                  </p>
                </div>
              )}

              {event.category && (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Categoría</p>
                  <p className="font-medium">{event.category}</p>
                </div>
              )}

              {event.paymentMethod && (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Método de pago</p>
                  <p className="font-medium">{event.paymentMethod}</p>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                onEdit(event)
                onOpenChange(false)
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                onDelete(event.id)
                onOpenChange(false)
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
