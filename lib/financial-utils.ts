import type { CalendarEvent, FinancialStats } from "./types"

export const calculateFinancialStats = (
  events: CalendarEvent[],
  statsView: "mensual" | "anual",
  selectedMonth: number,
  selectedYear: number
): FinancialStats => {
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

  // Nueva tendencia
  const monthlyTrend = calculateTrend(events, statsView, selectedMonth, selectedYear)

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    incomeByCategory,
    expensesByCategory,
    monthlyTrend,
  }
}

const calculateTrend = (
  events: CalendarEvent[],
  statsView: "mensual" | "anual",
  selectedMonth: number,
  selectedYear: number
) => {
  if (statsView === "mensual") {
    // Por días del mes seleccionado
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const trend = []
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter((e) => {
        const d = new Date(e.date)
        return (
          d.getFullYear() === selectedYear &&
          d.getMonth() === selectedMonth &&
          d.getDate() === day
        )
      })
      const income = dayEvents.filter((e) => e.type === "income").reduce((sum, e) => sum + (e.amount || 0), 0)
      const expenses = dayEvents.filter((e) => e.type === "expense").reduce((sum, e) => sum + (e.amount || 0), 0)
      trend.push({
        month: day.toString(),
        income,
        expenses,
      })
    }
    return trend
  } else {
    // Por meses del año seleccionado
    const trend = []
    for (let m = 0; m < 12; m++) {
      const monthEvents = events.filter((e) => {
        const d = new Date(e.date)
        return d.getFullYear() === selectedYear && d.getMonth() === m
      })
      const income = monthEvents.filter((e) => e.type === "income").reduce((sum, e) => sum + (e.amount || 0), 0)
      const expenses = monthEvents.filter((e) => e.type === "expense").reduce((sum, e) => sum + (e.amount || 0), 0)
      trend.push({
        month: new Date(selectedYear, m).toLocaleString("es-ES", { month: "short" }),
        income,
        expenses,
      })
    }
    return trend
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
