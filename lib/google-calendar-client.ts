"use client"

export interface ParsedExpense {
  id: string
  date: string
  amount: number
  house: string
  category: string
  originalTitle: string
}

export interface HouseData {
  name: string
  totalExpenses: number
  expenses: ParsedExpense[]
}

export interface DashboardData {
  houses: { [key: string]: HouseData }
  totalExpenses: number
  expenses: ParsedExpense[]
  lastSync: string
}

// Parser para eventos del calendario
export function parseExpenseFromTitle(title: string, dateStr: string, eventId: string): ParsedExpense | null {
  // Formato: $100 House A Utilities
  const regex = /^\$(\d+(?:\.\d{2})?)\s+(.+?)\s+(.+)$/
  const match = title.match(regex)

  if (!match) return null

  const [, amountStr, house, category] = match

  return {
    id: eventId,
    date: dateStr,
    amount: Number.parseFloat(amountStr),
    house: house.trim(),
    category: category.trim(),
    originalTitle: title,
  }
}

// Procesar eventos y crear dashboard
export function processCalendarEvents(events: any[]): DashboardData {
  const expenses: ParsedExpense[] = []
  const houses: { [key: string]: HouseData } = {}
  let totalExpenses = 0

  events.forEach((event) => {
    if (!event.start?.date && !event.start?.dateTime) return

    const dateStr = event.start.date || event.start.dateTime.split("T")[0]
    const parsed = parseExpenseFromTitle(event.summary, dateStr, event.id)

    if (parsed) {
      expenses.push(parsed)
      totalExpenses += parsed.amount

      if (!houses[parsed.house]) {
        houses[parsed.house] = {
          name: parsed.house,
          totalExpenses: 0,
          expenses: [],
        }
      }
      houses[parsed.house].totalExpenses += parsed.amount
      houses[parsed.house].expenses.push(parsed)
    }
  })

  return {
    houses,
    totalExpenses,
    expenses: expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    lastSync: new Date().toISOString(),
  }
}

// Guardar y cargar datos del localStorage
export function saveDashboardData(data: DashboardData) {
  localStorage.setItem("dashboard-data", JSON.stringify(data))
  localStorage.setItem("dashboard-last-sync", new Date().toISOString())
}

export function loadDashboardData(): DashboardData | null {
  const data = localStorage.getItem("dashboard-data")
  return data ? JSON.parse(data) : null
}

// Gestión de casas personalizadas
export function getCustomHouses(): string[] {
  const houses = localStorage.getItem("custom-houses")
  return houses ? JSON.parse(houses) : []
}

export function addCustomHouse(houseName: string) {
  const houses = getCustomHouses()
  if (!houses.includes(houseName)) {
    houses.push(houseName)
    localStorage.setItem("custom-houses", JSON.stringify(houses))
  }
}

export function removeCustomHouse(houseName: string) {
  const houses = getCustomHouses()
  const filtered = houses.filter((h) => h !== houseName)
  localStorage.setItem("custom-houses", JSON.stringify(filtered))
}
