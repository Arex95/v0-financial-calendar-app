export interface Entity {
  id: string
  name: string
  type: string // Changed from union to string for extensibility
  createdAt: string
  currency: string
  totalIncome: number
  totalExpenses: number
  events: Event[]
}

export interface CategoryConfig {
  [entityType: string]: string[]
}

export interface Account {
  id: string
  name: string
  type: "Credit Card" | "Debit Card" | "Bank Account" | "Cash"
  currency: string
  balance: number
  limit?: number
  lastFourDigits?: string
  createdAt: string
}

export interface Event {
  id: string
  date: string
  entityId?: string // Link to an entity
  accountId?: string // Link to an account
  category: string
  amount: number
  currency: string
  description: string
  eventType: "income" | "expense"
  type: "entity" | "personal"
}

// Legacy type alias for backwards compatibility
export type Expense = Event

export interface BankCard {
  id: string
  name: string
  cardNumber: string
  cardType: "savings" | "checking" | "credit" | "investment"
  currency: string
  balance: number
  limit?: number
  lastFourDigits: string
}

export interface FinancialData {
  events: Event[] // Renamed from expenses
  entities: Record<string, Entity>
  personalEvents: Event[] // Renamed from personalExpenses
  accounts: Account[] // Combined cards and accounts
  cards: BankCard[] // Legacy, kept for backwards compat
  totalIncome: number
  totalExpenses: number
  personalTotalIncome: number
  personalTotalExpenses: number
  currency: string
  customEntityTypes: string[] // Custom entity types added by user
  customCategories: CategoryConfig // Custom categories per entity type
}

// Default entity types
export const DEFAULT_ENTITY_TYPES = ["House", "Car", "Person", "Business", "Other"]

// Default categories per entity type
export const DEFAULT_CATEGORIES: CategoryConfig = {
  House: ["Mortgage", "Utilities", "Maintenance", "Insurance", "Property Tax", "HOA Fees", "Repairs", "Furniture"],
  Car: ["Gas", "Maintenance", "Insurance", "Registration", "Car Payment", "Parking", "Repairs", "Car Wash"],
  Person: ["Healthcare", "Education", "Personal Care", "Clothing", "Subscriptions", "Entertainment", "Gifts"],
  Business: ["Rent", "Payroll", "Marketing", "Supplies", "Equipment", "Software", "Utilities", "Professional Services"],
  Other: ["General", "Miscellaneous"],
  "Credit Card": ["Mensualidad", "Interest", "Fees"],
}

// Common income categories
export const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Rental Income", "Business Income", "Other"]

const STORAGE_KEY = "financial-data-v3" // Changed key for accounts system

export function getFinancialData(): FinancialData {
  if (typeof window === "undefined") {
    return {
      events: [],
      entities: {},
      personalEvents: [],
      accounts: [],
      cards: [],
      totalIncome: 0,
      totalExpenses: 0,
      personalTotalIncome: 0,
      personalTotalExpenses: 0,
      currency: "USD",
      customEntityTypes: [],
      customCategories: {},
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return {
      events: [],
      entities: {},
      personalEvents: [],
      accounts: [],
      cards: [],
      totalIncome: 0,
      totalExpenses: 0,
      personalTotalIncome: 0,
      personalTotalExpenses: 0,
      currency: "USD",
      customEntityTypes: [],
      customCategories: {},
    }
  }

  return JSON.parse(stored)
}

export function saveFinancialData(data: FinancialData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function addEvent(event: Omit<Event, "id">): Event {
  const data = getFinancialData()
  const newEvent: Event = {
    ...event,
    id: `evt-${Date.now()}`,
  }

  if (event.type === "entity" && event.entityId) {
    data.events.push(newEvent)
    if (event.eventType === "expense") {
      data.totalExpenses += event.amount
    } else {
      data.totalIncome += event.amount
    }

    if (data.entities[event.entityId]) {
      data.entities[event.entityId].events.push(newEvent)
      if (event.eventType === "expense") {
        data.entities[event.entityId].totalExpenses += event.amount
      } else {
        data.entities[event.entityId].totalIncome += event.amount
      }
    }
  } else {
    data.personalEvents.push(newEvent)
    if (event.eventType === "expense") {
      data.personalTotalExpenses += event.amount
    } else {
      data.personalTotalIncome += event.amount
    }
  }

  saveFinancialData(data)
  return newEvent
}

// Legacy function for backwards compatibility
export function addExpense(expense: Omit<Expense, "id">): Expense {
  return addEvent({ ...expense, eventType: "expense" })
}

export function removeEvent(eventId: string): void {
  const data = getFinancialData()
  const event = data.events.find((e) => e.id === eventId) || data.personalEvents.find((e) => e.id === eventId)

  if (!event) return

  if (event.type === "entity" && event.entityId) {
    data.events = data.events.filter((e) => e.id !== eventId)
    if (event.eventType === "expense") {
      data.totalExpenses -= event.amount
    } else {
      data.totalIncome -= event.amount
    }

    if (data.entities[event.entityId]) {
      data.entities[event.entityId].events = data.entities[event.entityId].events.filter(
        (e) => e.id !== eventId,
      )
      if (event.eventType === "expense") {
        data.entities[event.entityId].totalExpenses -= event.amount
      } else {
        data.entities[event.entityId].totalIncome -= event.amount
      }
    }
  } else {
    data.personalEvents = data.personalEvents.filter((e) => e.id !== eventId)
    if (event.eventType === "expense") {
      data.personalTotalExpenses -= event.amount
    } else {
      data.personalTotalIncome -= event.amount  
    }
  }

  saveFinancialData(data)
}

// Legacy function for backwards compatibility
export function removeExpense(expenseId: string): void {
  removeEvent(expenseId)
}

export function addEntity(name: string, type: Entity["type"], currency = "USD"): Entity {
  const data = getFinancialData()
  const entityId = `entity-${Date.now()}`
  const newEntity: Entity = {
    id: entityId,
    name: name,
    type: type,
    createdAt: new Date().toISOString(),
    currency,
    totalIncome: 0,
    totalExpenses: 0,
    events: [],
  }

  data.entities[entityId] = newEntity
  saveFinancialData(data)
  return newEntity
}

export function removeEntity(entityId: string): void {
  const data = getFinancialData()
  delete data.entities[entityId]
  data.events = data.events.filter((e) => e.entityId !== entityId)
  saveFinancialData(data)
}

export function addAccount(account: Omit<Account, "id" | "createdAt">): Account {
  const data = getFinancialData()
  const newAccount: Account = {
    ...account,
    id: `acc-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  data.accounts.push(newAccount)
  saveFinancialData(data)
  return newAccount
}

export function removeAccount(accountId: string): void {
  const data = getFinancialData()
  data.accounts = data.accounts.filter((a) => a.id !== accountId)
  saveFinancialData(data)
}

export function updateAccount(accountId: string, updates: Partial<Account>): void {
  const data = getFinancialData()
  const account = data.accounts.find((a) => a.id === accountId)
  if (account) {
    Object.assign(account, updates)
    saveFinancialData(data)
  }
}

export function addBankCard(card: Omit<BankCard, "id">): BankCard {
  const data = getFinancialData()
  const newCard: BankCard = {
    ...card,
    id: `card-${Date.now()}`,
  }

  data.cards.push(newCard)
  saveFinancialData(data)
  return newCard
}

export function removeBankCard(cardId: string): void {
  const data = getFinancialData()
  data.cards = data.cards.filter((c) => c.id !== cardId)
  saveFinancialData(data)
}

export function updateBankCard(cardId: string, updates: Partial<BankCard>): void {
  const data = getFinancialData()
  const card = data.cards.find((c) => c.id === cardId)
  if (card) {
    Object.assign(card, updates)
    saveFinancialData(data)
  }
}

// Category Management
export function getCategoriesForEntityType(entityType: string): string[] {
  const data = getFinancialData()
  const customCats = data.customCategories[entityType] || []
  const defaultCats = DEFAULT_CATEGORIES[entityType] || []
  return [...new Set([...defaultCats, ...customCats])]
}

export function addCustomCategory(entityType: string, category: string): void {
  const data = getFinancialData()
  if (!data.customCategories[entityType]) {
    data.customCategories[entityType] = []
  }
  if (!data.customCategories[entityType].includes(category)) {
    data.customCategories[entityType].push(category)
    saveFinancialData(data)
  }
}

export function removeCustomCategory(entityType: string, category: string): void {
  const data = getFinancialData()
  if (data.customCategories[entityType]) {
    data.customCategories[entityType] = data.customCategories[entityType].filter((c) => c !== category)
    saveFinancialData(data)
  }
}

// Entity Type Management
export function getAllEntityTypes(): string[] {
  const data = getFinancialData()
  return [...DEFAULT_ENTITY_TYPES, ...data.customEntityTypes]
}

export function addCustomEntityType(entityType: string): void {
  const data = getFinancialData()
  if (!data.customEntityTypes.includes(entityType) && !DEFAULT_ENTITY_TYPES.includes(entityType)) {
    data.customEntityTypes.push(entityType)
    saveFinancialData(data)
  }
}

export function removeCustomEntityType(entityType: string): void {
  const data = getFinancialData()
  data.customEntityTypes = data.customEntityTypes.filter((t) => t !== entityType)
  saveFinancialData(data)
}

// Test Data Generator
export function generateTestData(): void {
  const data = getFinancialData()
  
  // Clear existing data
  data.entities = {}
  data.events = []
  data.personalEvents = []
  data.accounts = []
  data.totalIncome = 0
  data.totalExpenses = 0
  data.personalTotalIncome = 0
  data.personalTotalExpenses = 0
  
  // Create entities
  const house = addEntity("Casa Principal", "House")
  const car = addEntity("Toyota Camry", "Car")
  const person = addEntity("Juan Pérez", "Person")
  
  // Create accounts
  const creditCard1 = addAccount({
    name: "Visa Platinum",
    type: "Credit Card",
    currency: "USD",
    balance: 2500,
    limit: 5000,
    lastFourDigits: "4532",
  })
  
  const creditCard2 = addAccount({
    name: "Mastercard Gold",
    type: "Credit Card",
    currency: "USD",
    balance: 1200,
    limit: 3000,
    lastFourDigits: "5678",
  })
  
  addAccount({
    name: "Cuenta Corriente",
    type: "Bank Account",
    currency: "USD",
    balance: 15000,
  })
  
  addAccount({
    name: "Efectivo",
    type: "Cash",
    currency: "USD",
    balance: 0,
  })
  
  // Generate events for the last 6 months
  const now = new Date()
  const categories = {
    House: ["Mortgage", "Utilities", "Maintenance", "Insurance"],
    Car: ["Gas", "Maintenance", "Insurance", "Car Payment"],
    Person: ["Healthcare", "Education", "Groceries", "Entertainment"],
  }
  
  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const eventDate = new Date(now)
    eventDate.setMonth(eventDate.getMonth() - monthOffset)
    
    // House expenses
    addEvent({
      entityId: house.id,
      accountId: creditCard1.id,
      category: "Mortgage",
      amount: 1500 + Math.random() * 100,
      description: "Pago hipoteca mensual",
      eventType: "expense",
      type: "entity",
      currency: "USD",
      date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 5).toISOString(),
    })
    
    addEvent({
      entityId: house.id,
      category: "Utilities",
      amount: 150 + Math.random() * 50,
      description: "Servicios públicos",
      eventType: "expense",
      type: "entity",
      currency: "USD",
      date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 10).toISOString(),
    })
    
    if (Math.random() > 0.5) {
      addEvent({
        entityId: house.id,
        category: "Maintenance",
        amount: 200 + Math.random() * 300,
        description: "Reparaciones del hogar",
        eventType: "expense",
        type: "entity",
        currency: "USD",
        date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 15).toISOString(),
      })
    }
    
    // Car expenses
    addEvent({
      entityId: car.id,
      category: "Gas",
      amount: 80 + Math.random() * 40,
      description: "Gasolina",
      eventType: "expense",
      type: "entity",
      currency: "USD",
      date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 7).toISOString(),
    })
    
    addEvent({
      entityId: car.id,
      accountId: creditCard2.id,
      category: "Car Payment",
      amount: 450,
      description: "Pago de carro",
      eventType: "expense",
      type: "entity",
      currency: "USD",
      date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 12).toISOString(),
    })
    
    if (monthOffset % 3 === 0) {
      addEvent({
        entityId: car.id,
        category: "Maintenance",
        amount: 150 + Math.random() * 200,
        description: "Mantenimiento vehicular",
        eventType: "expense",
        type: "entity",
        currency: "USD",
        date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 20).toISOString(),
      })
    }
    
    // Person expenses
    addEvent({
      entityId: person.id,
      category: "Healthcare",
      amount: 100 + Math.random() * 150,
      description: "Gastos médicos",
      eventType: "expense",
      type: "entity",
      currency: "USD",
      date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 8).toISOString(),
    })
    
    addEvent({
      entityId: person.id,
      category: "Entertainment",
      amount: 50 + Math.random() * 100,
      description: "Entretenimiento",
      eventType: "expense",
      type: "entity",
      currency: "USD",
      date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 18).toISOString(),
    })
    
    // Credit card payments (Mensualidad)
    addEvent({
      accountId: creditCard1.id,
      category: "Mensualidad",
      amount: 500,
      description: "Pago mensualidad Visa",
      eventType: "expense",
      type: "personal",
      currency: "USD",
      date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 25).toISOString(),
    })
    
    addEvent({
      accountId: creditCard2.id,
      category: "Mensualidad",
      amount: 300,
      description: "Pago mensualidad Mastercard",
      eventType: "expense",
      type: "personal",
      currency: "USD",
      date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 27).toISOString(),
    })
    
    // Income
    addEvent({
      category: "Salary",
      amount: 5000,
      description: "Salario mensual",
      eventType: "income",
      type: "personal",
      currency: "USD",
      date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 1).toISOString(),
    })
    
    if (Math.random() > 0.6) {
      addEvent({
        category: "Freelance",
        amount: 500 + Math.random() * 1000,
        description: "Proyecto freelance",
        eventType: "income",
        type: "personal",
        currency: "USD",
        date: new Date(eventDate.getFullYear(), eventDate.getMonth(), 15).toISOString(),
      })
    }
  }
  
  console.log("Test data generated successfully!")
}
