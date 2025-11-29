
"use client"

import { useState } from "react"
import { getFinancialData, addEvent, removeEvent, removeBankCard, removeEntity, generateTestData } from "@/lib/local-storage"
import Layout from "@/components/kokonutui/layout"
import DashboardStats from "@/components/dashboard-stats"
import EntityCard from "@/components/entity-card"
import BankCard from "@/components/bank-card"
import AddEventModal from "@/components/add-event-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Database } from "lucide-react"

export default function DashboardPage() {
  const [data, setData] = useState(getFinancialData())
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [expenseType, setExpenseType] = useState<"entity" | "personal">("entity")
  const [showAddCard, setShowAddCard] = useState(false)

  const refreshData = () => setData(getFinancialData())

  const handleAddEvent = (event: any) => {
    addEvent(event)
    refreshData()
  }

  const handleRemoveEvent = (eventId: string) => {
    removeEvent(eventId)
    refreshData()
  }

  const handleRemoveEntity = (entityId: string) => {
    removeEntity(entityId)
    refreshData()
  }

  const entities = Object.values(data.entities)

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, here's your financial overview.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <Button
              onClick={() => {
                setExpenseType("entity")
                setShowAddExpense(true)
              }}
              className="flex-1 sm:flex-none"
              disabled={entities.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir Evento
            </Button>
            <Button
              onClick={() => {
                generateTestData()
                window.location.reload()
              }}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <Database className="w-4 h-4 mr-2" />
              Datos de Prueba
            </Button>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats
          totalExpenses={data.totalExpenses}
          totalHouses={entities.length}
          averagePerHouse={data.totalExpenses / (entities.length || 1)}
          personalExpenses={data.personalTotalExpenses}
        />

        {/* Entities Section */}
        {entities.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Your Entities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.map((entity) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  onDelete={() => handleRemoveEntity(entity.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Personal Cards Section */}
        {data.cards.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Your Cards</h2>
              <Button onClick={() => setShowAddCard(true)} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.cards.map((card) => (
                <BankCard
                  key={card.id}
                  name={card.name}
                  balance={card.balance}
                  limit={card.limit}
                  currency={card.currency}
                  lastFourDigits={card.lastFourDigits}
                  cardType={card.cardType}
                  onDelete={() => {
                    removeBankCard(card.id)
                    refreshData()
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity (Combined) */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.events, ...data.personalEvents]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((expense) => (
                        <tr key={expense.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">{new Date(expense.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${expense.type === "entity"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                }`}
                            >
                              {expense.type === "entity" && expense.entityId && data.entities[expense.entityId]
                                ? data.entities[expense.entityId].name
                                : "Personal"}
                            </span>
                          </td>
                          <td className="py-3 px-4">{expense.category}</td>
                          <td className="text-right py-3 px-4 font-semibold">
                            {expense.currency} {expense.amount.toFixed(2)}
                          </td>
                          <td className="text-center py-3 px-4">
                            <button
                              onClick={() => handleRemoveEvent(expense.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Event Modal */}
        {showAddExpense && (
          <AddEventModal
            onClose={() => setShowAddExpense(false)}
            onAdd={handleAddEvent}
            entities={entities}
            accounts={data.accounts}
            defaultType={expenseType}
          />
        )}
      </div>
    </Layout>
  )
}
