"use client"

import { cn } from "@/lib/utils"
import { Trash2, Edit2 } from "lucide-react"

interface BankCardProps {
  name: string
  balance: number
  limit?: number
  currency: string
  lastFourDigits: string
  cardType: "savings" | "checking" | "credit" | "investment"
  onDelete?: () => void
  onEdit?: () => void
  className?: string
}

const cardGradients = {
  savings: "from-emerald-600 to-green-600",
  checking: "from-blue-600 to-cyan-600",
  credit: "from-purple-600 to-pink-600",
  investment: "from-amber-600 to-orange-600",
}

const cardIcons = {
  savings: "💰",
  checking: "💳",
  credit: "💎",
  investment: "📈",
}

export default function BankCard({
  name,
  balance,
  limit,
  currency,
  lastFourDigits,
  cardType,
  onDelete,
  onEdit,
  className,
}: BankCardProps) {
  const gradient = cardGradients[cardType]
  const icon = cardIcons[cardType]

  return (
    <div
      className={cn(
        "group relative",
        "bg-gradient-to-br",
        gradient,
        "rounded-2xl p-6",
        "border border-white/20 backdrop-blur-md",
        "hover:border-white/40 hover:shadow-2xl",
        "transition-all duration-300 transform hover:scale-105 hover:-translate-y-2",
        "shadow-lg dark:shadow-2xl",
        "min-h-[280px] flex flex-col justify-between",
        className,
      )}
    >
      <div>
        <div className="flex items-start justify-between mb-8">
          <div className="text-4xl">{icon}</div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-white/80 text-sm font-medium mb-2">{name}</p>
        <h3 className="text-white text-lg font-semibold mb-6">
          {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-white/70 text-xs font-medium mb-1">Balance</p>
          <p className="text-white text-3xl font-bold">
            {currency}
            {balance.toFixed(2)}
          </p>
        </div>

        {limit && (
          <div>
            <p className="text-white/70 text-xs font-medium mb-1">Credit Limit</p>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${Math.min((balance / limit) * 100, 100)}%` }}
              />
            </div>
            <p className="text-white/80 text-xs mt-1">
              {currency}
              {balance.toFixed(2)} / {currency}
              {limit.toFixed(2)}
            </p>
          </div>
        )}

        <p className="text-white/70 text-sm font-mono">•••• •••• •••• {lastFourDigits}</p>
      </div>
    </div>
  )
}
