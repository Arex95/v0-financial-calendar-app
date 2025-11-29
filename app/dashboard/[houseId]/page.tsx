"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ExpensesChart from "@/components/expenses-chart"
import DashboardStats from "@/components/dashboard-stats"

interface HouseExpense {
  id: string
  title: string
  amount: number
  category: string
  date: string
}

interface HouseStats {
  name: string
  totalExpenses: number
  expenseCount: number
  averageExpense: number
}

export default function HouseDashboardPage() {
  const params = useParams()
  const houseId = params.houseId as string
  const [house, setHouse] = useState<HouseStats | null>(null)
  const [expenses, setExpenses] = useState<HouseExpense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const response = await fetch(`/api/houses/${houseId}`)
        if (response.ok) {
          const data = await response.json()
          setHouse(data)
        }
      } catch (error) {
        console.error("Error fetching house data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (houseId) {
      fetchHouseData()
    }
  }, [houseId])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!house) {
    return <div className="text-center py-8">House not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{house.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{house.expenseCount} expenses tracked</p>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats totalExpenses={house.totalExpenses} totalHouses={1} averagePerHouse={house.averageExpense} />

      {/* Chart */}
      <ExpensesChart
        data={[
          { name: "Week 1", amount: 100 },
          { name: "Week 2", amount: 150 },
          { name: "Week 3", amount: 120 },
          { name: "Week 4", amount: 180 },
        ]}
      />

      {/* Expenses List */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Expenses</h2>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No expenses yet</p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {expense.date} • {expense.category}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">${expense.amount.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
