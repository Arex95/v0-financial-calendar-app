'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface CreditCardCardProps {
  cardName: string;
  cardNumber: string;
  paidAmount: number;
  totalAmount: number;
}

export function CreditCardCard({ cardName, cardNumber, paidAmount, totalAmount }: CreditCardCardProps) {
  const paidPercentage = (paidAmount / totalAmount) * 100;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{cardName}</span>
        <span className="text-sm text-muted-foreground">{cardNumber}</span>
      </div>
      <div>
        <Progress value={paidPercentage} className="mb-2" />
        <div className="flex justify-between items-center">
          <span className="text-sm">Paid: ${paidAmount}</span>
          <span className="text-sm">Total: ${totalAmount}</span>
        </div>
      </div>
    </Card>
  );
}

export function AddCreditCardCard() {
  return (
    <Card className="p-4 flex flex-col items-center justify-center h-full border-dashed">
      <Button variant="ghost" className="flex flex-col h-auto">
        <PlusCircle className="w-8 h-8 mb-2" />
        Add Credit Card
      </Button>
    </Card>
  );
}
