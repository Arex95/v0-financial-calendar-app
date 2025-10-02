import type { CalendarEvent, FinancialStats } from "./types"

export const calculateFinancialStats = (events: CalendarEvent[]): FinancialStats => {
  const incomeEvents = events.filter((e) => e.type === "income")
  const expenseEvents = events.filter((e) => e.type === "expense")

  const totalIncome = incomeEvents.reduce((sum, e) => sum + (e.amount || 0), 0)
  const totalExpenses = expenseEvents.reduce((sum, e) => sum + (e.amount || 0), 0)

  const incomeByCategory: Record<string, number> = {}
  incomeEvents.forEach((e) => {
    const cat = e.category || "Sin categoría"
    incomeByCategory[cat] = (incomeByCategory[cat] || 0) + (e.amount || 0)
  })

  const expensesByCategory: Record<string, number> = {}
  expenseEvents.forEach((e) => {
    const cat = e.category || "Sin categoría"
    expensesByCategory[cat] = (expensesByCategory[cat] || 0) + (e.amount || 0)
  })

  // Calculate monthly trend for last 6 months
  const monthlyTrend = calculateMonthlyTrend(events)

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    incomeByCategory,
    expensesByCategory,
    monthlyTrend,
  }
}

const calculateMonthlyTrend = (events: CalendarEvent[]) => {
  const months: Array<{ month: string; income: number; expenses: number }> = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEvents = events.filter((e) => {
      const eventDate = new Date(e.date)
      return eventDate.getFullYear() === date.getFullYear() && eventDate.getMonth() === date.getMonth()
    })

    const income = monthEvents.filter((e) => e.type === "income").reduce((sum, e) => sum + (e.amount || 0), 0)

    const expenses = monthEvents.filter((e) => e.type === "expense").reduce((sum, e) => sum + (e.amount || 0), 0)

    months.push({
      month: date.toLocaleDateString("es-ES", { month: "short", year: "numeric" }),
      income,
      expenses,
    })
  }

  return months
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}
