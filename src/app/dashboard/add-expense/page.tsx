'use client'

import { addExpense } from "@/app/actions/transaction"
import Navbar from "@/components/Navbar"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function AddExpensePage() {
    const { data: session } = useSession()
    if (session === null) redirect("/login")

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        await addExpense(formData)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar user={session?.user} />

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h1 className="text-2xl font-bold mb-6">Add Expense</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                            <input
                                name="description"
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                placeholder="Groceries, Rent, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                            <input
                                name="amount"
                                type="number"
                                step="0.01"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select
                                name="category"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 [&>option]:bg-gray-900"
                            >
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Housing">Housing</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Health">Health</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input
                                name="date"
                                type="date"
                                required
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Expense'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
