"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCalendarSync } from "@/hooks/use-calendar-sync"
import { getCustomHouses, addCustomHouse, removeCustomHouse } from "@/lib/google-calendar-client"
import Layout from "@/components/kokonutui/layout"
import DashboardStats from "@/components/dashboard-stats"
import ExpensesChart from "@/components/expenses-chart"
import HouseBreakdown from "@/components/house-breakdown"
import HouseDashboard from "@/components/house-dashboard"
import HouseManager from "@/components/house-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, loading, error, syncCalendar } = useCalendarSync()
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [customHouses, setCustomHouses] = useState<string[]>([])
  const [showHouseManager, setShowHouseManager] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    const token = searchParams.get("token")
    const userStr = searchParams.get("user")
    const authSuccess = searchParams.get("auth_success")

    if (token) {
      localStorage.setItem("google-access-token", token)
      if (userStr) {
        localStorage.setItem("google-user-info", userStr)
        setUserInfo(JSON.parse(userStr))
      }
      // Clean URL
      router.replace("/dashboard")
    }

    const token_stored = localStorage.getItem("google-access-token")
    if (!token_stored) {
      router.push("/login")
      return
    }

    const userInfoStored = localStorage.getItem("google-user-info")
    if (userInfoStored) {
      setUserInfo(JSON.parse(userInfoStored))
    }

    setCustomHouses(getCustomHouses())
  }, [router, searchParams])

  // Auto-sync on mount
  useEffect(() => {
    if (localStorage.getItem("google-access-token")) {
      syncCalendar()
    }
  }, [])

  if (!localStorage.getItem("google-access-token")) {
    return null
  }

  const stats = data
    ? {
        totalExpenses: data.totalExpenses,
        totalHouses: Object.keys(data.houses).length,
        averagePerHouse: data.totalExpenses / (Object.keys(data.houses).length || 1),
      }
    : { totalExpenses: 0, totalHouses: 0, averagePerHouse: 0 }

  const chartData = data
    ? Object.entries(data.houses).map(([name, house]) => ({
        name,
        amount: house.totalExpenses,
      }))
    : []

  const handleAddHouse = (houseName: string) => {
    addCustomHouse(houseName)
    setCustomHouses(getCustomHouses())
  }

  const handleRemoveHouse = (houseName: string) => {
    removeCustomHouse(houseName)
    setCustomHouses(getCustomHouses())
    if (selectedHouse === houseName) {
      setSelectedHouse(null)
    }
  }

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header with user and sync */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            {userInfo && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, <span className="font-semibold">{userInfo.name}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={syncCalendar}
              disabled={loading}
              className="flex-1 sm:flex-none bg-transparent"
              variant="outline"
            >
              {loading ? "Syncing..." : "Sync Calendar"}
            </Button>
            <Button onClick={() => setShowHouseManager(true)} className="flex-1 sm:flex-none" variant="outline">
              Manage Houses
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("google-access-token")
                localStorage.removeItem("google-user-info")
                router.push("/login")
              }}
              className="flex-1 sm:flex-none"
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6 text-sm text-red-600 dark:text-red-400">{error}</CardContent>
          </Card>
        )}

        {/* Global Dashboard */}
        {!selectedHouse && (
          <>
            <DashboardStats
              totalExpenses={stats.totalExpenses}
              totalHouses={stats.totalHouses}
              averagePerHouse={stats.averagePerHouse}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ExpensesChart data={chartData} />
              <HouseBreakdown data={chartData} />
            </div>

            {/* All Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>All Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {data && data.expenses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">Date</th>
                          <th className="text-left py-2 px-3">House</th>
                          <th className="text-left py-2 px-3">Category</th>
                          <th className="text-right py-2 px-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.expenses.map((expense) => (
                          <tr key={expense.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <td className="py-2 px-3">{new Date(expense.date).toLocaleDateString()}</td>
                            <td className="py-2 px-3">{expense.house}</td>
                            <td className="py-2 px-3">{expense.category}</td>
                            <td className="text-right py-2 px-3 font-semibold">${expense.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No expenses found. Create events in your calendar starting with "$"
                  </p>
                )}
              </CardContent>
            </Card>

            {/* House Selection */}
            {data && Object.keys(data.houses).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by House</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(data.houses).map(([houseName]) => (
                      <Button
                        key={houseName}
                        onClick={() => setSelectedHouse(houseName)}
                        variant="outline"
                        className="h-auto p-4 flex-col items-start"
                      >
                        <span className="font-semibold">{houseName}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ${data.houses[houseName].totalExpenses.toFixed(2)}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Individual House Dashboard */}
        {selectedHouse && data && (
          <HouseDashboard
            house={selectedHouse}
            houseData={data.houses[selectedHouse]}
            onBack={() => setSelectedHouse(null)}
          />
        )}

        {/* House Manager Modal */}
        {showHouseManager && (
          <HouseManager
            onClose={() => setShowHouseManager(false)}
            onAdd={handleAddHouse}
            onRemove={handleRemoveHouse}
          />
        )}
      </div>
    </Layout>
  )
}
