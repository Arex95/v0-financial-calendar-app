"use client"

import { useState } from "react"
import { getFinancialData, addEntity, removeEntity } from "@/lib/local-storage"
import type { Entity } from "@/lib/local-storage"
import Layout from "@/components/kokonutui/layout"
import EntityCard from "@/components/entity-card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function EntitiesPage() {
  const [data, setData] = useState(getFinancialData())
  const [showAddEntity, setShowAddEntity] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [newEntityName, setNewEntityName] = useState("")
  const [newEntityType, setNewEntityType] = useState<Entity["type"]>("House")

  const refreshData = () => setData(getFinancialData())

  const handleAddEntity = () => {
    if (newEntityName.trim()) {
      addEntity(newEntityName.trim(), newEntityType)
      setNewEntityName("")
      setNewEntityType("House")
      setShowAddEntity(false)
      refreshData()
    }
  }

  const handleRemoveEntity = (entityId: string) => {
    removeEntity(entityId)
    refreshData()
  }

  const handleViewDetails = (entity: Entity) => {
    setSelectedEntity(entity)
    setShowDetailsModal(true)
  }

  const handleEdit = (entity: Entity) => {
    setSelectedEntity(entity)
    setNewEntityName(entity.name)
    setNewEntityType(entity.type)
    setShowEditModal(true)
  }

  const entities = Object.values(data.entities)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Entities</h1>
            <p className="text-muted-foreground">Manage your houses, cars, people, and other entities.</p>
          </div>
          <Button onClick={() => setShowAddEntity(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Entity
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              onDelete={() => handleRemoveEntity(entity.id)}
              onViewDetails={() => handleViewDetails(entity)}
              onEdit={() => handleEdit(entity)}
            />
          ))}
        </div>

        {entities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No entities found. Add one to get started.</p>
          </div>
        )}

        {/* Add Entity Modal */}
        {showAddEntity && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Entity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    placeholder="Entity name (e.g., Main House, Tesla, John)"
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={newEntityType}
                    onValueChange={(value) => setNewEntityType(value as Entity["type"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Person">Person</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleAddEntity} className="flex-1">
                    Add Entity
                  </Button>
                  <Button onClick={() => setShowAddEntity(false)} className="flex-1" variant="outline">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedEntity && (
          <Dialog open={true} onOpenChange={setShowDetailsModal}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedEntity.name} - Eventos
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedEntity.events && selectedEntity.events.length > 0 ? (
                  <div className="space-y-2">
                    {selectedEntity.events.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{event.description || event.category}</div>
                            <div className="text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${event.eventType === "income" ? "text-green-600" : "text-red-600"}`}>
                              {event.eventType === "income" ? "+" : "-"} {event.currency} {event.amount.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">{event.category}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay eventos para esta entidad
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Modal - Placeholder for future implementation */}
        {showEditModal && selectedEntity && (
          <Dialog open={true} onOpenChange={setShowEditModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Entidad</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">Funcionalidad de edición próximamente...</p>
              <Button onClick={() => setShowEditModal(false)}>Cerrar</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  )
}
