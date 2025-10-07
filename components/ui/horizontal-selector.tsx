"use client"

import React from "react"

interface HorizontalSelectorProps {
  items: string[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export function HorizontalSelector({ items, selectedIndex, onSelect }: HorizontalSelectorProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 py-2 px-1">
        {items.map((item, idx) => (
          <button
            key={item}
            className={`px-3 py-1 rounded-full whitespace-nowrap border transition
              ${idx === selectedIndex
                ? "bg-primary text-white border-primary shadow"
                : "bg-muted text-foreground border-muted hover:bg-primary/10"}
            `}
            onClick={() => onSelect(idx)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}