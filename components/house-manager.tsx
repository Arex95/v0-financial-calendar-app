"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HouseManagerProps {
  onClose: () => void
  onAdd: (houseName: string) => void
  onRemove: (houseName: string) => void
}

export default function HouseManager({ onClose, onAdd, onRemove }: HouseManagerProps) {
  const [newHouseName, setNewHouseName] = useState("")

  const handleAdd = () => {
    if (newHouseName.trim()) {
      onAdd(newHouseName.trim())
      setNewHouseName("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Houses</CardTitle>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="House name..."
              value={newHouseName}
              onChange={(e) => setNewHouseName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground"
            />
            <Button onClick={handleAdd} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-primary">
            Houses are auto-detected from your calendar events (format: "$100 House Name Category")
          </div>

          <Button onClick={onClose} className="w-full bg-transparent" variant="outline">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
