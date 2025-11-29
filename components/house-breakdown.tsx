"use client"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface HouseData {
  name: string
  value: number
}

interface HouseBreakdownProps {
  data: HouseData[]
  className?: string
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#6366f1", "#f97316"]

export default function HouseBreakdown({ data, className }: HouseBreakdownProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640

  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-[#0F0F12] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-[#1F1F23]",
        className,
      )}
    >
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Expenses by Entity</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={isMobile ? false : ({ name, value }) => `${name}: $${value.toFixed(0)}`}
            outerRadius={isMobile ? 70 : 100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `$${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
