"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/financial-utils"

interface CategoryBreakdownProps {
  title: string
  categories: Record<string, number>
  type: "income" | "expense"
}

export function CategoryBreakdown({ title, categories, type }: CategoryBreakdownProps) {
  const entries = Object.entries(categories).sort(([, a], [, b]) => b - a)
  const total = entries.reduce((sum, [, amount]) => sum + amount, 0)

  if (entries.length === 0) {
    return (
      <Card className="card-base">
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>{title}</h3>
        <p style={{ color: "var(--muted-foreground)", textAlign: "center", padding: "2rem 0", fontSize: "0.95rem" }}>
          No hay datos disponibles
        </p>
      </Card>
    )
  }

  return (
    <Card className="card-base">
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: type === "income" ? "var(--success)" : "var(--destructive)",
          marginBottom: "0.25rem"
        }}>{title}</h3>
        <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
          Total: <span style={{ fontWeight: 600, color: type === "income" ? "var(--success)" : "var(--destructive)" }}>
            {formatCurrency(total)}
          </span>
        </p>
      </div>
      <div>
        {entries.map(([category, amount]) => {
          const percentage = (amount / total) * 100
          return (
            <div key={category} style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>{category}</span>
                <span style={{
                  fontWeight: 700,
                  color: type === "income" ? "var(--success)" : "var(--destructive)"
                }}>
                  {formatCurrency(amount)}
                </span>
              </div>
              <Progress
                value={percentage}
                style={{
                  height: "0.5rem",
                  background: "var(--muted)",
                  borderRadius: "var(--radius)",
                  "--progress-color": type === "income" ? "var(--success)" : "var(--destructive)"
                } as React.CSSProperties}
                indicatorClassName=""
              />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
