"use client"

import { Calendar, CreditCard, Building2 } from "lucide-react"
import { useState } from "react"
import List02 from "./list-02"
import ExpensesByHouse from "../expenses-by-house"
import HouseManager from "../house-manager"

export default function Content() {
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [showHouseManager, setShowHouseManager] = useState(false)

  // Mock data - will be replaced with real API calls
  const mockExpenses = [
    { id: "1", title: "$Electricity Bill", amount: 150, category: "Utilities", date: "2024-01-15", house: "House A" },
    { id: "2", title: "$Water Bill", amount: 75, category: "Utilities", date: "2024-01-16", house: "House B" },
    { id: "3", title: "$Maintenance", amount: 200, category: "Repairs", date: "2024-01-17", house: "House A" },
  ]

  return (
    <div className="space-y-4">
      {/* Top Row - Accounts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
            Houses
          </h2>
          <div className="flex-1">
            <HouseManager onManageClick={() => setShowHouseManager(!showHouseManager)} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
            Recent Transactions
          </h2>
          <div className="flex-1">
            <List02 className="h-full" />
          </div>
        </div>
      </div>

      {/* Expenses by House */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
        <ExpensesByHouse expenses={mockExpenses} selectedHouse={selectedHouse} onSelectHouse={setSelectedHouse} />
      </div>

      {/* Calendar Events */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
          Upcoming Events
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Connect your Google Calendar to sync expenses marked with $
        </p>
      </div>
    </div>
  )
}
