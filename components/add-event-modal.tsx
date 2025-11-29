"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Entity, Account } from "@/lib/local-storage"
import { getCategoriesForEntityType, addCustomCategory, INCOME_CATEGORIES } from "@/lib/local-storage"

interface AddEventModalProps {
  onClose: () => void
  onAdd: (event: any) => void
  entities?: Entity[]
  accounts?: Account[]
  defaultType?: "entity" | "personal" // Kept for backwards compatibility but not used
}

export default function AddEventModal({
  onClose,
  onAdd,
  entities = [],
  accounts = [],
}: AddEventModalProps) {
  const [eventType, setEventType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [selectedEntityId, setSelectedEntityId] = useState(entities.length > 0 ? entities[0].id : "")
  const [selectedAccountId, setSelectedAccountId] = useState(accounts.length > 0 ? accounts[0].id : "")

  const selectedEntity = useMemo(() => {
    return entities.find((e) => e.id === selectedEntityId)
  }, [entities, selectedEntityId])

  const availableCategories = useMemo(() => {
    if (eventType === "income") {
      return INCOME_CATEGORIES.map(name => ({ id: name, name, color: "#22c55e" })) // Green for income
    }

    if (selectedEntity) {
      return getCategoriesForEntityType(selectedEntity.type)
    }

    // Fallback to generic categories
    const genericCats = ["General", "Other"]
    return genericCats.map(name => ({ id: name, name, color: "#64748b" }))
  }, [eventType, selectedEntity])

  useEffect(() => {
    if (availableCategories.length > 0 && !category) {
      setCategory(availableCategories[0].name)
    }
  }, [availableCategories, category])

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && selectedEntity) {
      addCustomCategory(selectedEntity.type, customCategory.trim())
      setCategory(customCategory.trim())
      setCustomCategory("")
      setShowCustomCategory(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEntityId) {
      alert("Por favor selecciona una entidad")
      return
    }

    onAdd({
      amount: Number.parseFloat(amount),
      description,
      category,
      type: "entity", // All events are now entity events
      eventType,
      entityId: selectedEntityId,
      accountId: selectedAccountId || undefined,
      currency: "USD",
      date: new Date().toISOString(),
    })
    onClose()
  }

  if (entities.length === 0) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Añadir Evento</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            <p className="mb-4">Primero debes crear al menos una entidad (Casa, Persona, Negocio, etc.) antes de añadir eventos.</p>
            <Button onClick={onClose}>Entendido</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Añadir Evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Evento</Label>
            <Select value={eventType} onValueChange={(v: "income" | "expense") => {
              setEventType(v)
              setCategory("")
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Ingreso</SelectItem>
                <SelectItem value="expense">Gasto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Entidad *</Label>
            <Select value={selectedEntityId} onValueChange={(v) => {
              setSelectedEntityId(v)
              setCategory("")
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.type === "House" ? "🏠" : entity.type === "Car" ? "🚗" : entity.type === "Person" ? "👤" : entity.type === "Business" ? "💼" : "📁"} {entity.name} ({entity.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cantidad</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Categoría</Label>
              {eventType === "expense" && !showCustomCategory && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomCategory(true)}
                  className="h-7 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Nueva
                </Button>
              )}
            </div>
            {showCustomCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Nueva categoría"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" size="sm" onClick={handleAddCustomCategory}>Añadir</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowCustomCategory(false)}>Cancelar</Button>
              </div>
            ) : (
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {accounts.length > 0 && (
            <div className="space-y-2">
              <Label>Cuenta (opcional)</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar cuenta" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input
              placeholder="¿Para qué fue esto?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Añadir Evento</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
