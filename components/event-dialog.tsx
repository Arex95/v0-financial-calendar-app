"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CalendarEvent, EventType } from "@/lib/types"

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (event: Omit<CalendarEvent, "id">) => void
  selectedDate?: Date
  event?: CalendarEvent
}

const incomeCategories = ["Salario", "Freelance", "Inversiones", "Ventas", "Otros ingresos"]

const expenseCategories = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Compras",
  "Otros gastos",
]

const paymentMethods = ["Efectivo", "Tarjeta de débito", "Tarjeta de crédito", "Transferencia", "PayPal", "Otro"]

export function EventDialog({ open, onOpenChange, onSave, selectedDate, event }: EventDialogProps) {
  const [eventType, setEventType] = useState<EventType>("normal")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  useEffect(() => {
    if (event) {
      setEventType(event.type)
      setTitle(event.title)
      setDescription(event.description || "")
      setDate(event.date.split("T")[0])
      setAmount(event.amount?.toString() || "")
      setCategory(event.category || "")
      setPaymentMethod(event.paymentMethod || "")
    } else if (selectedDate) {
      setDate(selectedDate.toISOString().split("T")[0])
    }
  }, [event, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEvent: Omit<CalendarEvent, "id"> = {
      title,
      description: description || undefined,
      date,
      type: eventType,
      ...(eventType !== "normal" && {
        amount: Number.parseFloat(amount),
        category,
        paymentMethod,
      }),
    }

    onSave(newEvent)
    handleClose()
  }

  const handleClose = () => {
    setEventType("normal")
    setTitle("")
    setDescription("")
    setDate("")
    setAmount("")
    setCategory("")
    setPaymentMethod("")
    onOpenChange(false)
  }

  const categories = eventType === "income" ? incomeCategories : expenseCategories

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Editar evento" : "Nuevo evento"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de evento</Label>
            <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Evento normal</SelectItem>
                <SelectItem value="income">Ingreso</SelectItem>
                <SelectItem value="expense">Gasto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del evento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción opcional"
              rows={3}
            />
          </div>

          {eventType !== "normal" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
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

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecciona una categoría" />
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

              <div className="space-y-2">
                <Label htmlFor="payment">Método de pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment">
                    <SelectValue placeholder="Selecciona un método" />
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

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
