"use client"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  house: string
}

interface ExpensesByHouseProps {
  expenses: Expense[]
  selectedHouse?: string
  onSelectHouse?: (house: string) => void
  className?: string
}

export default function ExpensesByHouse({ expenses, selectedHouse, onSelectHouse, className }: ExpensesByHouseProps) {
  const houses = Array.from(new Set(expenses.map((e) => e.house)))
  const filteredExpenses = selectedHouse ? expenses.filter((e) => e.house === selectedHouse) : expenses

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]",
        className,
      )}
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
        Expenses by House
      </h2>

      {/* House Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => onSelectHouse?.(null)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
            !selectedHouse
              ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700",
          )}
        >
          All Houses
        </button>
        {houses.map((house) => (
          <button
            key={house}
            onClick={() => onSelectHouse?.(house)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              selectedHouse === house
                ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700",
            )}
          >
            {house}
          </button>
        ))}
      </div>

      {/* Total Amount */}
      <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Total {selectedHouse ? `for ${selectedHouse}` : ""}</p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">${totalExpenses.toFixed(2)}</p>
      </div>

      {/* Expenses List */}
      <div className="space-y-2">
        {filteredExpenses.length === 0 ? (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center py-4">No expenses found</p>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-900 dark:text-white">{expense.title}</p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  {expense.date} • {expense.category}
                </p>
              </div>
              <p className="text-xs font-medium text-zinc-900 dark:text-white">${expense.amount.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
