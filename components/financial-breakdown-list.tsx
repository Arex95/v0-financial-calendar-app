import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Event, Entity, getCategoriesForEntityType } from "@/lib/local-storage"

interface FinancialBreakdownListProps {
  events: Event[]
  entities: Record<string, Entity>
  personalEvents: Event[]
}

interface CategoryTotal {
  name: string
  amount: number
  percentage: number
  type: "income" | "expense"
  color?: string
}

interface EntityBreakdown {
  id: string
  name: string
  type: string
  incomeCategories: CategoryTotal[]
  expenseCategories: CategoryTotal[]
  totalIncome: number
  totalExpenses: number
}

export default function FinancialBreakdownList({
  events,
  entities,
  personalEvents,
}: FinancialBreakdownListProps) {
  // Helper to process events
  const processEvents = (
    entityEvents: Event[],
    entityId: string,
    entityName: string,
    entityType: string
  ): EntityBreakdown => {
    const incomeMap = new Map<string, number>()
    const expenseMap = new Map<string, number>()
    let totalIncome = 0
    let totalExpenses = 0

    entityEvents.forEach((event) => {
      if (event.eventType === "income") {
        const current = incomeMap.get(event.category) || 0
        incomeMap.set(event.category, current + event.amount)
        totalIncome += event.amount
      } else {
        const current = expenseMap.get(event.category) || 0
        expenseMap.set(event.category, current + event.amount)
        totalExpenses += event.amount
      }
    })

    // Get categories with colors
    const availableCategories = getCategoriesForEntityType(entityType)
    const getCategoryColor = (name: string) => availableCategories.find(c => c.name === name)?.color

    const incomeCategories: CategoryTotal[] = Array.from(incomeMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
        type: "income" as const,
        color: getCategoryColor(name)
      }))
      .sort((a, b) => b.amount - a.amount)

    const expenseCategories: CategoryTotal[] = Array.from(expenseMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        type: "expense" as const,
        color: getCategoryColor(name)
      }))
      .sort((a, b) => b.amount - a.amount)

    return {
      id: entityId,
      name: entityName,
      type: entityType,
      incomeCategories,
      expenseCategories,
      totalIncome,
      totalExpenses,
    }
  }

  // Process Entity Events
  const entityBreakdowns: EntityBreakdown[] = Object.values(entities).map((entity) => {
    const entityEvents = events.filter((e) => e.entityId === entity.id)
    return processEvents(entityEvents, entity.id, entity.name, entity.type)
  })

  // Process Personal Events
  const personalBreakdown = processEvents(personalEvents, "personal", "Personal", "Personal") // Assuming "Personal" is a type or mapped to something

  // Combine all
  const allBreakdowns = [...entityBreakdowns]
  if (personalBreakdown.totalIncome > 0 || personalBreakdown.totalExpenses > 0) {
    allBreakdowns.push(personalBreakdown)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {allBreakdowns.map((breakdown) => (
        <Card key={breakdown.id} className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{breakdown.name}</span>
              <span className="text-sm font-normal text-muted-foreground">{breakdown.type}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Income Section */}
            {breakdown.incomeCategories.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-green-600 flex justify-between items-center">
                  <span>Ingresos</span>
                  <span className="text-sm">
                    ${breakdown.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </h3>
                <div className="space-y-3">
                  {breakdown.incomeCategories.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{cat.name}</span>
                        <span className="font-medium">
                          ${cat.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <Progress
                        value={cat.percentage}
                        className="h-2 bg-secondary"
                        indicatorClassName={!cat.color ? "bg-green-500" : undefined}
                        indicatorStyle={cat.color ? { backgroundColor: cat.color } : undefined}
                      />
                      <p className="text-xs text-muted-foreground text-right">{cat.percentage.toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expenses Section */}
            {breakdown.expenseCategories.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-red-600 flex justify-between items-center">
                  <span>Gastos</span>
                  <span className="text-sm">
                    ${breakdown.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </h3>
                <div className="space-y-3">
                  {breakdown.expenseCategories.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{cat.name}</span>
                        <span className="font-medium">
                          ${cat.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <Progress
                        value={cat.percentage}
                        className="h-2 bg-secondary"
                        indicatorClassName={!cat.color ? "bg-red-500" : undefined}
                        indicatorStyle={cat.color ? { backgroundColor: cat.color } : undefined}
                      />
                      <p className="text-xs text-muted-foreground text-right">{cat.percentage.toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {breakdown.incomeCategories.length === 0 && breakdown.expenseCategories.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No hay datos registrados para esta entidad.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
