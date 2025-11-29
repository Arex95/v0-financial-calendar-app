export const EXPENSE_CATEGORIES = {
  COMMON_AREAS: {
    Rent: { icon: "🏠", color: "bg-blue-100 dark:bg-blue-900/30", textColor: "text-blue-600 dark:text-blue-400" },
    Utilities: {
      icon: "⚡",
      color: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    Water: { icon: "💧", color: "bg-cyan-100 dark:bg-cyan-900/30", textColor: "text-cyan-600 dark:text-cyan-400" },
    Cleaning: {
      icon: "🧹",
      color: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400",
    },
    Maintenance: {
      icon: "🔧",
      color: "bg-orange-100 dark:bg-orange-900/30",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    Groceries: { icon: "🛒", color: "bg-red-100 dark:bg-red-900/30", textColor: "text-red-600 dark:text-red-400" },
    Internet: {
      icon: "📡",
      color: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    Gas: { icon: "🔥", color: "bg-amber-100 dark:bg-amber-900/30", textColor: "text-amber-600 dark:text-amber-400" },
    Insurance: {
      icon: "🛡️",
      color: "bg-indigo-100 dark:bg-indigo-900/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    Supplies: { icon: "📦", color: "bg-pink-100 dark:bg-pink-900/30", textColor: "text-pink-600 dark:text-pink-400" },
  },
  PERSONAL: {
    Subscriptions: {
      icon: "📺",
      color: "bg-violet-100 dark:bg-violet-900/30",
      textColor: "text-violet-600 dark:text-violet-400",
    },
    Entertainment: {
      icon: "🎬",
      color: "bg-rose-100 dark:bg-rose-900/30",
      textColor: "text-rose-600 dark:text-rose-400",
    },
    Dining: {
      icon: "🍽️",
      color: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
      textColor: "text-fuchsia-600 dark:text-fuchsia-400",
    },
    Shopping: {
      icon: "🛍️",
      color: "bg-emerald-100 dark:bg-emerald-900/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    Transport: { icon: "🚗", color: "bg-lime-100 dark:bg-lime-900/30", textColor: "text-lime-600 dark:text-lime-400" },
    Healthcare: { icon: "🏥", color: "bg-red-100 dark:bg-red-900/30", textColor: "text-red-600 dark:text-red-400" },
    Education: { icon: "📚", color: "bg-sky-100 dark:bg-sky-900/30", textColor: "text-sky-600 dark:text-sky-400" },
    Fitness: { icon: "💪", color: "bg-teal-100 dark:bg-teal-900/30", textColor: "text-teal-600 dark:text-teal-400" },
  },
}

export const PAYMENT_METHODS = [
  { id: "cash", name: "Cash", icon: "💵" },
  { id: "credit", name: "Credit Card", icon: "💳" },
  { id: "debit", name: "Debit Card", icon: "🏦" },
  { id: "transfer", name: "Bank Transfer", icon: "📲" },
]

export const CURRENCIES = [
  { id: "USD", name: "US Dollar", symbol: "$" },
  { id: "EUR", name: "Euro", symbol: "€" },
  { id: "GBP", name: "British Pound", symbol: "£" },
  { id: "MXN", name: "Mexican Peso", symbol: "$" },
  { id: "COP", name: "Colombian Peso", symbol: "$" },
  { id: "ARS", name: "Argentine Peso", symbol: "$" },
  { id: "CLP", name: "Chilean Peso", symbol: "$" },
  { id: "PEN", name: "Peruvian Sol", symbol: "S/" },
]

export const ACCOUNT_TYPES = [
  { id: "savings", name: "Savings", icon: "💰" },
  { id: "checking", name: "Checking", icon: "💳" },
  { id: "credit", name: "Credit Card", icon: "🏦" },
  { id: "investment", name: "Investment", icon: "📈" },
]
