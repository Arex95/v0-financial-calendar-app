export type EventType = "normal" | "income" | "expense"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string // ISO date string
  type: EventType
  // Financial fields (only for income/expense events)
  amount?: number
  category?: string
  paymentMethod?: string
}

export interface FinancialStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  incomeByCategory: Record<string, number>
  expensesByCategory: Record<string, number>
  monthlyTrend: Array<{ month: string; income: number; expenses: number }>
}
