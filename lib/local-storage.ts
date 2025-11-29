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

export interface CategoryItem {
  id: string
  name: string
  color: string
}

export interface CategoryConfig {
  [entityType: string]: CategoryItem[]
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
  events: Event[]
  entities: Record<string, Entity>
  personalEvents: Event[]
  accounts: Account[]
  cards: BankCard[]
  totalIncome: number
  totalExpenses: number
  personalTotalIncome: number
  personalTotalExpenses: number
  currency: string
  customEntityTypes: string[]
  customCategories: CategoryConfig
}

// Default entity types
export const DEFAULT_ENTITY_TYPES = ["House", "Car", "Person", "Business", "Other"]

const DEFAULT_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e", 
  "#10b981", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", 
  "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"
]

const getRandomColor = (index?: number) => {
  if (typeof index === 'number') {
    return DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }
  return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]
}

// Counter to ensure unique IDs even when called multiple times in same millisecond
let idCounter = 0

// Generate unique ID with timestamp + counter + random number to avoid collisions
const generateUniqueId = (prefix: string): string => {
  idCounter++
  return `${prefix}-${Date.now()}-${idCounter}-${Math.random().toString(36).substring(2, 9)}`
}

// Helper to create default categories with colors
const createDefaultCategories = (names: string[], startIndex = 0): CategoryItem[] => {
  return names.map((name, i) => ({
    id: generateUniqueId('cat'),
    name,
    color: getRandomColor(startIndex + i)
  }))
}

// Default categories per entity type
export const DEFAULT_CATEGORIES: CategoryConfig = {
  House: createDefaultCategories(["Mortgage", "Utilities", "Maintenance", "Insurance", "Property Tax", "HOA Fees", "Repairs", "Furniture"], 0),
  Car: createDefaultCategories(["Gas", "Maintenance", "Insurance", "Registration", "Car Payment", "Parking", "Repairs", "Car Wash"], 5),
  Person: createDefaultCategories(["Healthcare", "Education", "Personal Care", "Clothing", "Subscriptions", "Entertainment", "Gifts"], 10),
  Business: createDefaultCategories(["Rent", "Payroll", "Marketing", "Supplies", "Equipment", "Software", "Utilities", "Professional Services"], 3),
  Other: createDefaultCategories(["General", "Miscellaneous"], 8),
  "Credit Card": createDefaultCategories(["Mensualidad", "Interest", "Fees"], 12),
}

// Common income categories
export const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Rental Income", "Business Income", "Other"]

const STORAGE_KEY = "financial-data-v3"

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

  const data = JSON.parse(stored)

  // Migration: Convert string[] categories to CategoryItem[]
  // Check if customCategories values are strings (old format)
  let migrated = false
  if (data.customCategories) {
    Object.keys(data.customCategories).forEach(key => {
      const cats = data.customCategories[key]
      if (Array.isArray(cats) && cats.length > 0 && typeof cats[0] === 'string') {
        data.customCategories[key] = (cats as unknown as string[]).map((name, i) => ({
          id: `cat-custom-${Date.now()}-${i}`,
          name,
          color: getRandomColor(i)
        }))
        migrated = true
      }
    })
  }

  if (migrated) {
    saveFinancialData(data)
  }

  return data
}

export function saveFinancialData(data: FinancialData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function addEvent(event: Omit<Event, "id">): Event {
  const data = getFinancialData()
  const newEvent: Event = {
    ...event,
    id: generateUniqueId('evt'),
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
  const entityId = generateUniqueId('entity')
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
    id: generateUniqueId('acc'),
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
    id: generateUniqueId('card'),
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

// Entity Type Management
export function getAllEntityTypes(): string[] {
  const data = getFinancialData()
  const allTypes = new Set([...DEFAULT_ENTITY_TYPES, ...(data.customEntityTypes || [])])
  return Array.from(allTypes)
}

// Category Management
export function getCategoriesForEntityType(entityType: string): CategoryItem[] {
  const data = getFinancialData()
  const customCats = (data.customCategories || {})[entityType] || []
  const defaultCats = DEFAULT_CATEGORIES[entityType] || []
  
  // Merge by name to avoid duplicates if user added a custom one that matches default
  const allCats = [...defaultCats, ...customCats]
  const uniqueCats = new Map<string, CategoryItem>()
  allCats.forEach(cat => {
    if (!uniqueCats.has(cat.name)) {
      uniqueCats.set(cat.name, cat)
    }
  })
  
  return Array.from(uniqueCats.values())
}

export function getCategoryNamesForEntityType(entityType: string): string[] {
  return getCategoriesForEntityType(entityType).map(c => c.name)
}

export function addCustomCategory(entityType: string, categoryName: string, color?: string): void {
  const data = getFinancialData()
  if (!data.customCategories[entityType]) {
    data.customCategories[entityType] = []
  }
  
  // Check if already exists in custom or default
  const existing = getCategoriesForEntityType(entityType).find(c => c.name === categoryName)
  
  if (!existing) {
    data.customCategories[entityType].push({
      id: `cat-custom-${Date.now()}`,
      name: categoryName,
      color: color || getRandomColor()
    })
    saveFinancialData(data)
  }
}

export function updateCategory(entityType: string, categoryId: string, updates: Partial<CategoryItem>): void {
  const data = getFinancialData()
  
  // Check custom categories first
  if (data.customCategories[entityType]) {
    const catIndex = data.customCategories[entityType].findIndex(c => c.id === categoryId)
    if (catIndex >= 0) {
      data.customCategories[entityType][catIndex] = { ...data.customCategories[entityType][catIndex], ...updates }
      saveFinancialData(data)
      return
    }
  }
  
  // If it's a default category, we need to "override" it by adding it to custom categories with the new values
  // But wait, DEFAULT_CATEGORIES is constant. We can't modify it. 
  // We should copy it to customCategories if modified.
  // Actually, for simplicity, let's say we can only edit custom categories or we copy default to custom on edit.
  // Better approach: Store "overrides" or just copy all defaults to custom on first load? No, that's messy.
  
  // Let's assume for now we only edit custom categories. 
  // OR, if the user tries to edit a default category, we create a copy in customCategories and the UI should prefer custom over default.
  // But getCategoriesForEntityType merges them.
  
  // Let's try to find it in default
  const defaultCat = DEFAULT_CATEGORIES[entityType]?.find(c => c.id === categoryId)
  if (defaultCat) {
    // It's a default category. We can't change the constant.
    // We need to store the modified version in customCategories.
    // But we need a way to know "this custom category replaces that default category".
    // For now, let's just add it as a new custom category and maybe the UI filters duplicates by ID? 
    // But IDs are different.
    
    // Simpler solution for this exercise: 
    // Just allow editing custom categories. If user wants to edit default, they can't (or we clone it).
    // Let's implement editing only for custom categories for now, or assume we can't edit defaults easily without a bigger refactor.
    // Wait, the user wants to "visualize en listado cada categoria y poderlas editar".
    
    // I will add a `modifiedCategories` or just treat `customCategories` as the source of truth for *additions*.
    // If I want to edit a default, I should probably add it to `customCategories` and have logic to prefer it.
    // But `getCategoriesForEntityType` dedupes by NAME.
    // So if I add a custom category with same name but different color, it might work if I prioritize custom.
    
    if (!data.customCategories[entityType]) data.customCategories[entityType] = []
    
    // Check if we already have an override
    const existingOverrideIndex = data.customCategories[entityType].findIndex(c => c.name === defaultCat.name)
    if (existingOverrideIndex >= 0) {
       data.customCategories[entityType][existingOverrideIndex] = { ...data.customCategories[entityType][existingOverrideIndex], ...updates }
    } else {
       // Create new override
       data.customCategories[entityType].push({ ...defaultCat, ...updates })
    }
    saveFinancialData(data)
  }
}

export function removeCustomCategory(entityType: string, categoryId: string): void {
  const data = getFinancialData()
  if (data.customCategories[entityType]) {
    data.customCategories[entityType] = data.customCategories[entityType].filter((c) => c.id !== categoryId)
    saveFinancialData(data)
  }
}


// Test Data Generator
export function generateTestData(): void {
  const data = getFinancialData()
  
  // Reset ID counter to ensure fresh IDs
  idCounter = 0
  
  // Clear existing data
  data.entities = {}
  data.events = []
  data.personalEvents = []
  data.accounts = []
  data.cards = [] // Clear cards too
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