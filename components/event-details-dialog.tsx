'use client'

import { Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { CalendarEvent } from '@/lib/types'
import { formatCurrency } from '@/lib/financial-utils'

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className={`event-type-indicator event-type-${event.type}`} />
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Date</p>
            <p className="font-medium">
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Type</p>
            <p className="font-medium capitalize">
              {event.type === 'income' && 'Income'}
              {event.type === 'expense' && 'Expense'}
              {event.type === 'normal' && 'Normal Event'}
            </p>
          </div>

          {event.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{event.description}</p>
            </div>
          )}

          {event.type !== 'normal' && (
            <>
              {event.amount && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className={`text-2xl font-bold event-amount-${event.type}`}>
                    {event.type === 'income' ? '+' : '-'}
                    {formatCurrency(event.amount)}
                  </p>
                </div>
              )}

              {event.category && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="font-medium">{event.category}</p>
                </div>
              )}

              {event.paymentMethod && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-medium">{event.paymentMethod}</p>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onEdit(event)
                onOpenChange(false)
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
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
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}