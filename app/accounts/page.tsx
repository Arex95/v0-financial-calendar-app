"use client"

import { useState } from "react"
import { getFinancialData, addAccount, removeAccount, type Account } from "@/lib/local-storage"
import Layout from "@/components/kokonutui/layout"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard, Banknote, Wallet, Trash2, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

export default function AccountsPage() {
  const [data, setData] = useState(getFinancialData())
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [accountName, setAccountName] = useState("")
  const [accountType, setAccountType] = useState<Account["type"]>("Bank Account" as Account["type"])
  const [accountBalance, setAccountBalance] = useState("")
  const [accountLimit, setAccountLimit] = useState("")
  const [lastFourDigits, setLastFourDigits] = useState("")

  const refreshData = () => setData(getFinancialData())

  const handleAddAccount = () => {
    if (accountName.trim() && (accountType === "Cash" || accountBalance.trim())) {
      addAccount({
        name: accountName.trim(),
        type: accountType,
        currency: "USD",
        balance: accountType === "Cash" ? 0 : Number.parseFloat(accountBalance),
        limit: accountLimit ? Number.parseFloat(accountLimit) : undefined,
        lastFourDigits: lastFourDigits || undefined,
      })
      setAccountName("")
      setAccountBalance("")
      setAccountLimit("")
      setLastFourDigits("")
      setShowAddAccount(false)
      refreshData()
    }
  }

  const confirmDeleteAccount = (account: Account) => {
    setSelectedAccount(account)
    setShowDeleteDialog(true)
  }

  const handleRemoveAccount = () => {
    if (selectedAccount) {
      removeAccount(selectedAccount.id)
      setShowDeleteDialog(false)
      setSelectedAccount(null)
      refreshData()
    }
  }

  const getAccountIcon = (type: Account["type"]) => {
    switch (type) {
      case "Credit Card":
        return <CreditCard className="w-5 h-5" />
      case "Debit Card":
        return <CreditCard className="w-5 h-5" />
      case "Bank Account":
        return <Banknote className="w-5 h-5" />
      case "Cash":
        return <Wallet className="w-5 h-5" />
      default:
        return <Wallet className="w-5 h-5" />
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cuentas</h1>
            <p className="text-muted-foreground">Gestiona tus tarjetas de crédito y cuentas bancarias.</p>
          </div>
          <Button onClick={() => setShowAddAccount(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Añadir Cuenta
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.accounts.map((account) => {
            const usagePercent = account.limit ? (account.balance / account.limit) * 100 : 0
            const availableCredit = account.limit ? account.limit - account.balance : 0

            return (
              <Card key={account.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getAccountIcon(account.type)}
                      <CardTitle className="text-base">{account.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDeleteAccount(account)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <span className="text-sm font-medium">{account.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span className="text-lg font-bold">
                      {account.currency} {account.balance.toFixed(2)}
                    </span>
                  </div>
                  {account.limit && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Límite</span>
                        <span className="text-sm">
                          {account.currency} {account.limit.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Utilización</span>
                          <span className={`font-semibold ${usagePercent > 80 ? "text-destructive" : usagePercent > 50 ? "text-warning" : "text-success"}`}>
                            {usagePercent.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={usagePercent} className="h-2" />
                        <div className="text-xs text-muted-foreground text-right">
                          Disponible: {account.currency} {availableCredit.toFixed(2)}
                        </div>
                      </div>
                    </>
                  )}
                  {account.lastFourDigits && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Últimos Dígitos</span>
                      <span className="text-sm font-mono">****{account.lastFourDigits}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {data.accounts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay cuentas. Añade una para empezar.</p>
          </div>
        )}

        {showAddAccount && (
          <Dialog open={true} onOpenChange={setShowAddAccount}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Añadir Nueva Cuenta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre de la Cuenta</Label>
                  <Input
                    placeholder="ej. Tarjeta Principal, Cuenta Ahorros"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={accountType} onValueChange={(v) => setAccountType(v as Account["type"])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="Debit Card">Tarjeta de Débito</SelectItem>
                      <SelectItem value="Bank Account">Cuenta Bancaria</SelectItem>
                      <SelectItem value="Cash">Efectivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {accountType !== "Cash" && (
                  <div className="space-y-2">
                    <Label>Balance Actual</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(e.target.value)}
                    />
                  </div>
                )}
                {(accountType === "Credit Card" || accountType === "Debit Card") && (
                  <>
                    <div className="space-y-2">
                      <Label>Límite de Crédito (opcional)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={accountLimit}
                        onChange={(e) => setAccountLimit(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Últimos 4 Dígitos (opcional)</Label>
                      <Input
                        placeholder="1234"
                        maxLength={4}
                        value={lastFourDigits}
                        onChange={(e) => setLastFourDigits(e.target.value)}
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddAccount} className="flex-1">
                    Añadir
                  </Button>
                  <Button onClick={() => setShowAddAccount(false)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleRemoveAccount}
          title="¿Eliminar cuenta?"
          description={`¿Estás seguro de que quieres eliminar la cuenta "${selectedAccount?.name}"? Esta acción no se puede deshacer.`}
        />
      </div>
    </Layout>
  )
}
