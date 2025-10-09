'use client'

import {
  Landmark,
  Gift,
  AreaChart,
  Briefcase,
  Utensils,
  Bus,
  Home,
  Film,
  HeartPulse,
  ShoppingBag,
  HelpCircle
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  // Income
  Salary: Landmark,
  Gifts: Gift,
  Investments: AreaChart,
  Freelance: Briefcase,
  // Expenses
  Food: Utensils,
  Transport: Bus,
  Housing: Home,
  Entertainment: Film,
  Health: HeartPulse,
  Shopping: ShoppingBag,
  Default: HelpCircle,
};

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const Icon = iconMap[category] || iconMap.Default;
  return <Icon className={className} />;
}
