'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CalendarEvent, EventType } from '@/lib/types'

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (event: Omit<CalendarEvent, 'id'>) => void
  selectedDate?: Date
  event?: CalendarEvent
}

const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Sales', 'Other Income']

const expenseCategories = [
  'Food',
  'Transport',
  'Housing',
  'Services',
  'Entertainment',
  'Health',
  'Education',
  'Shopping',
  'Other Expenses',
]

const paymentMethods = ['Cash', 'Debit Card', 'Credit Card', 'Transfer', 'PayPal', 'Other']

export function EventDialog({ open, onOpenChange, onSave, selectedDate, event }: EventDialogProps) {
  const [eventType, setEventType] = useState<EventType>('normal')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  useEffect(() => {
    if (event) {
      setEventType(event.type)
      setTitle(event.title)
      setDescription(event.description || '')
      setDate(event.date.split('T')[0])
      setAmount(event.amount?.toString() || '')
      setCategory(event.category || '')
      setPaymentMethod(event.paymentMethod || '')
    } else if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0])
    }
  }, [event, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEvent: Omit<CalendarEvent, 'id'> = {
      title,
      description: description || undefined,
      date,
      type: eventType,
      ...(eventType !== 'normal' && {
        amount: Number.parseFloat(amount),
        category,
        paymentMethod,
      }),
    }

    onSave(newEvent)
    handleClose()
  }

  const handleClose = () => {
    setEventType('normal')
    setTitle('')
    setDescription('')
    setDate('')
    setAmount('')
    setCategory('')
    setPaymentMethod('')
    onOpenChange(false)
  }

  const categories = eventType === 'income' ? incomeCategories : expenseCategories

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'New Event'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <Label htmlFor="type">Event Type</Label>
            <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal Event</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
            />
          </div>

          <div className="form-group">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="form-group">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          {eventType !== 'normal' && (
            <>
              <div className="form-group">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label htmlFor="payment">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment">
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="form-actions">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}