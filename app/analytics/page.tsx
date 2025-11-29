"use client"

import { useState, useMemo } from "react"
import { getFinancialData } from "@/lib/local-storage"
import Layout from "@/components/kokonutui/layout"
import ExpensesChart from "@/components/expenses-chart"
import IncomeVsExpensesChart from "@/components/income-vs-expenses-chart"
import CategoryRadarChart from "@/components/category-radar-chart"
import FinancialBreakdownList from "@/components/financial-breakdown-list"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AnalyticsPage() {
  const [data] = useState(getFinancialData())
  const [selectedEntityId, setSelectedEntityId] = useState<string>("all")

  const chartEvents = useMemo(() => {
    if (selectedEntityId === "all") {
      return [...data.events, ...data.personalEvents]
    }
    if (selectedEntityId === "personal") {
      return data.personalEvents
    }
    return data.events.filter((e) => e.entityId === selectedEntityId)
  }, [data, selectedEntityId])

  const breakdownProps = useMemo(() => {
    if (selectedEntityId === "all") {
      return {
        events: data.events,
        entities: data.entities,
        personalEvents: data.personalEvents,
      }
    }
    if (selectedEntityId === "personal") {
      return {
        events: [],
        entities: {},
        personalEvents: data.personalEvents,
      }
    }
    // Handle case where entity might not exist (though it should if selected)
    const entity = data.entities[selectedEntityId]
    return {
      events: data.events.filter((e) => e.entityId === selectedEntityId),
      entities: entity ? { [selectedEntityId]: entity } : {},
      personalEvents: [],
    }
  }, [data, selectedEntityId])

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Análisis detallado de tus finanzas.</p>
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={selectedEntityId} onValueChange={setSelectedEntityId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar entidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las entidades</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                {Object.values(data.entities).map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ExpensesChart expenses={chartEvents} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeVsExpensesChart events={chartEvents} />
          <CategoryRadarChart events={chartEvents} />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight mb-4">Desglose por Entidad</h2>
          <FinancialBreakdownList
            events={breakdownProps.events}
            entities={breakdownProps.entities}
            personalEvents={breakdownProps.personalEvents}
          />
        </div>
      </div>
    </Layout>
  )
}
