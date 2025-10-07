"use client"

import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { FinancialStats } from "@/lib/types"
import { formatCurrency } from "@/lib/financial-utils"

interface FinancialSummaryProps {
  stats: FinancialStats
}

export function FinancialSummary({ stats }: FinancialSummaryProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      }}
    >
      <Card className="card-base">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--muted-foreground)",
                fontWeight: 500,
              }}
            >
              Ingresos totales
            </p>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--success)",
                marginTop: "0.25rem",
              }}
            >
              {formatCurrency(stats.totalIncome)}
            </p>
          </div>
          <div
            style={{
              height: "3rem",
              width: "3rem",
              borderRadius: "var(--radius)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "color-mix(in srgb, var(--success) 10%, transparent)",
            }}
          >
            <TrendingUp
              style={{ color: "var(--success)", width: "1.5rem", height: "1.5rem" }}
            />
          </div>
        </div>
      </Card>
      <Card className="card-base">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--muted-foreground)",
                fontWeight: 500,
              }}
            >
              Gastos totales
            </p>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--destructive)",
                marginTop: "0.25rem",
              }}
            >
              {formatCurrency(stats.totalExpenses)}
            </p>
          </div>
          <div
            style={{
              height: "3rem",
              width: "3rem",
              borderRadius: "var(--radius)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "color-mix(in srgb, var(--destructive) 10%, transparent)",
            }}
          >
            <TrendingDown
              style={{ color: "var(--destructive)", width: "1.5rem", height: "1.5rem" }}
            />
          </div>
        </div>
      </Card>
      <Card className="card-base">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--muted-foreground)",
                fontWeight: 500,
              }}
            >
              Balance
            </p>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color:
                  stats.balance >= 0 ? "var(--success)" : "var(--destructive)",
                marginTop: "0.25rem",
              }}
            >
              {formatCurrency(stats.balance)}
            </p>
          </div>
          <div
            style={{
              height: "3rem",
              width: "3rem",
              borderRadius: "var(--radius)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "color-mix(in srgb, var(--primary) 10%, transparent)",
            }}
          >
            <Wallet
              style={{ color: "var(--primary)", width: "1.5rem", height: "1.5rem" }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
