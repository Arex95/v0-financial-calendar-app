"use client"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface HouseData {
  name: string
  value: number
  [key: string]: any
}

interface HouseBreakdownProps {
  data: HouseData[]
  className?: string
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))"
]

export default function HouseBreakdown({ data, className }: HouseBreakdownProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640

  return (
    <div
      className={cn(
        "w-full bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border",
        className,
      )}
    >
      <h3 className="text-base sm:text-lg font-bold text-card-foreground mb-4">Expenses by Entity</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={isMobile ? false : ({ name, value }) => `${name}: $${value.toFixed(0)}`}
            outerRadius={isMobile ? 70 : 100}
            fill="hsl(var(--primary))"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `$${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--popover-foreground))",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
