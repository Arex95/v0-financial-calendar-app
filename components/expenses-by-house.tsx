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
  onSelectHouse?: (house: string | null) => void
  className?: string
}

export default function ExpensesByHouse({ expenses, selectedHouse, onSelectHouse, className }: ExpensesByHouseProps) {
  const houses = Array.from(new Set(expenses.map((e) => e.house)))
  const filteredExpenses = selectedHouse ? expenses.filter((e) => e.house === selectedHouse) : expenses

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div
      className={cn(
        "w-full bg-card rounded-xl p-6 flex flex-col border border-border",
        className,
      )}
    >
      <h2 className="text-lg font-bold text-card-foreground mb-4 text-left flex items-center gap-2">
        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
        Expenses by House
      </h2>

      {/* House Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => onSelectHouse?.(null)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
            !selectedHouse
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
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
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {house}
          </button>
        ))}
      </div>

      {/* Total Amount */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">Total {selectedHouse ? `for ${selectedHouse}` : ""}</p>
        <p className="text-2xl font-bold text-foreground">${totalExpenses.toFixed(2)}</p>
      </div>

      {/* Expenses List */}
      <div className="space-y-2">
        {filteredExpenses.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No expenses found</p>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{expense.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {expense.date} • {expense.category}
                </p>
              </div>
              <p className="text-xs font-medium text-foreground">${expense.amount.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
