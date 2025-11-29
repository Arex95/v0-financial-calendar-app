"use client"

import { useState, useEffect } from "react"
import { getFinancialData, type FinancialData } from "@/lib/local-storage"

export function useLocalExpenses() {
  const [data, setData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const financialData = getFinancialData()
    setData(financialData)
    setLoading(false)
  }, [])

  const refreshData = () => {
    const financialData = getFinancialData()
    setData(financialData)
  }

  return { data, loading, refreshData }
}
