"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, X } from "lucide-react"

interface House {
  id: string
  name: string
  totalExpenses: number
  expenseCount: number
}

export default function HouseManagerFull() {
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newHouseName, setNewHouseName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchHouses()
  }, [])

  const fetchHouses = async () => {
    try {
      const response = await fetch("/api/houses")
      if (response.ok) {
        const data = await response.json()
        setHouses(data)
      }
    } catch (error) {
      console.error("Error fetching houses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHouse = async () => {
    if (!newHouseName.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/houses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newHouseName }),
      })

      if (response.ok) {
        setNewHouseName("")
        setShowModal(false)
        await fetchHouses()
      }
    } catch (error) {
      console.error("Error adding house:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteHouse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this house and all its expenses?")) return

    try {
      const response = await fetch(`/api/houses/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchHouses()
      }
    } catch (error) {
      console.error("Error deleting house:", error)
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-600 dark:text-gray-400">Loading houses...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Houses</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-2 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add House
        </button>
      </div>

      {/* Houses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {houses.map((house) => (
          <div
            key={house.id}
            className="bg-white dark:bg-[#0F0F12] rounded-lg p-4 border border-gray-200 dark:border-[#1F1F23] hover:border-gray-300 dark:hover:border-[#2B2B30] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{house.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{house.expenseCount} expenses</p>
              </div>
              <button
                onClick={() => handleDeleteHouse(house.id)}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-[#1F1F23]">
              <p className="text-sm font-medium text-gray-900 dark:text-white">${house.totalExpenses.toFixed(2)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total spent</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add House Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0F0F12] rounded-lg border border-gray-200 dark:border-[#1F1F23] max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New House</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="House name..."
              value={newHouseName}
              onChange={(e) => setNewHouseName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddHouse()}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1F1F23] bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 mb-4"
              autoFocus
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-[#1F1F23] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHouse}
                disabled={submitting || !newHouseName.trim()}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
