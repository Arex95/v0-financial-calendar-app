"use client"

import { useState } from "react"
import { getFinancialData } from "@/lib/local-storage"
import Layout from "@/components/kokonutui/layout"
import ExpensesChart from "@/components/expenses-chart"
import IncomeVsExpensesChart from "@/components/income-vs-expenses-chart"
import CategoryRadarChart from "@/components/category-radar-chart"

export default function AnalyticsPage() {
  const [data] = useState(getFinancialData())

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Análisis detallado de tus finanzas.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ExpensesChart expenses={[...data.events, ...data.personalEvents]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeVsExpensesChart events={[...data.events, ...data.personalEvents]} />
          <CategoryRadarChart events={[...data.events, ...data.personalEvents]} />
        </div>
      </div>
    </Layout>
  )
}
