"use client"

import type { Expense } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ArrowLeft } from "lucide-react"

interface HouseData {
  totalExpenses: number
  expenses: Expense[]
}

interface HouseDashboardProps {
  house: string
  houseData: HouseData
  onBack: () => void
}

export default function HouseDashboard({ house, houseData, onBack }: HouseDashboardProps) {
  const expensesByCategory = houseData.expenses.reduce(
    (acc, exp) => {
      const existing = acc.find((e) => e.name === exp.category)
      if (existing) {
        existing.value += exp.amount
      } else {
        acc.push({ name: exp.category, value: exp.amount })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  const expensesByWeek = houseData.expenses.reduce(
    (acc, exp) => {
      const date = new Date(exp.date)
      const week = `Week ${Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}`
      const existing = acc.find((e) => e.name === week)
      if (existing) {
        existing.amount += exp.amount
      } else {
        acc.push({ name: week, amount: exp.amount })
      }
      return acc
    },
    [] as Array<{ name: string; amount: number }>,
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <Button onClick={onBack} variant="outline" className="gap-2 bg-transparent">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{house}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${houseData.totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">{houseData.expenses.length} expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average per Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${(houseData.totalExpenses / (houseData.expenses.length || 1)).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenses by Week</CardTitle>
        </CardHeader>
        <CardContent>
          {expensesByWeek.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={expensesByWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))' }}
                />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">No data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expensesByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))' }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">No data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {houseData.expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground">Date</th>
                    <th className="text-left py-2 px-3 text-muted-foreground">Category</th>
                    <th className="text-left py-2 px-3 text-muted-foreground">Description</th>
                    <th className="text-right py-2 px-3 text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {houseData.expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-2 px-3">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="py-2 px-3">{expense.category}</td>
                      <td className="py-2 px-3">{expense.description}</td>
                      <td className="text-right py-2 px-3 font-semibold">
                        {expense.currency} {expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No expenses recorded</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
