"use client"

import { useState } from "react"
import {
  getFinancialData,
  getAllEntityTypes,
  getCategoriesForEntityType,
  addCustomCategory,
  updateCategory,
  removeCustomCategory,
  CategoryItem
} from "@/lib/local-storage"
import Layout from "@/components/kokonutui/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
  "#10b981", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
  "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e", "#64748b", "#000000"
]

export default function CategoriesPage() {
  const [data, setData] = useState(getFinancialData())
  const [entityTypes] = useState(getAllEntityTypes())
  const [selectedEntityType, setSelectedEntityType] = useState<string>(entityTypes[0] || "House")

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Form states
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [categoryColor, setCategoryColor] = useState(PRESET_COLORS[0])
  const [categoryEntityType, setCategoryEntityType] = useState(entityTypes[0] || "House")

  const refreshData = () => setData(getFinancialData())

  const categories = getCategoriesForEntityType(selectedEntityType)

  const handleAddCategory = () => {
    if (categoryName.trim()) {
      addCustomCategory(categoryEntityType, categoryName.trim(), categoryColor)
      setIsAddDialogOpen(false)
      setCategoryName("")
      setCategoryColor(PRESET_COLORS[0])
      refreshData()
    }
  }

  const handleEditCategory = () => {
    if (editingCategory && categoryName.trim()) {
      updateCategory(selectedEntityType, editingCategory.id, {
        name: categoryName.trim(),
        color: categoryColor
      })
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      refreshData()
    }
  }

  const handleDeleteCategory = () => {
    if (editingCategory) {
      removeCustomCategory(selectedEntityType, editingCategory.id)
      setIsDeleteDialogOpen(false)
      setEditingCategory(null)
      refreshData()
    }
  }

  const openEditDialog = (category: CategoryItem) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setCategoryColor(category.color)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (category: CategoryItem) => {
    setEditingCategory(category)
    setIsDeleteDialogOpen(true)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
            <p className="text-muted-foreground">Gestiona las categorías de tus gastos e ingresos.</p>
          </div>
          <Button onClick={() => {
            setCategoryEntityType(selectedEntityType)
            setCategoryName("")
            setCategoryColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)])
            setIsAddDialogOpen(true)
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Filtrar por Entidad:</span>
          <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {entityTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
              <SelectItem value="Credit Card">Credit Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No hay categorías para esta entidad.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: category.color }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => openDeleteDialog(category)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Categoría</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Entidad</label>
                <Select value={categoryEntityType} onValueChange={setCategoryEntityType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ej. Comida, Transporte..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${categoryColor === color ? 'border-primary' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCategoryColor(color)}
                    />
                  ))}
                  <input
                    type="color"
                    value={categoryColor}
                    onChange={(e) => setCategoryColor(e.target.value)}
                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddCategory}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${categoryColor === color ? 'border-primary' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCategoryColor(color)}
                    />
                  ))}
                  <input
                    type="color"
                    value={categoryColor}
                    onChange={(e) => setCategoryColor(e.target.value)}
                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleEditCategory}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteCategory}
          title="¿Eliminar categoría?"
          description={`¿Estás seguro de que quieres eliminar la categoría "${editingCategory?.name}"? Esta acción no se puede deshacer.`}
        />
      </div>
    </Layout>
  )
}
