import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"
import { prisma } from "@/lib/prisma"
import { updateExpense } from "@/app/actions/transaction"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditExpensePage({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const expense = await prisma.expense.findUnique({
        where: { id: params.id, userId: session.user.id! },
    })

    if (!expense) redirect("/dashboard")

    const updateExpenseWithId = updateExpense.bind(null, expense.id)

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar user={session.user} />

            <main className="max-w-2xl mx-auto px-4 py-8">
                <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h1 className="text-2xl font-bold mb-6">Edit Expense</h1>

                    <form action={updateExpenseWithId} className="space-y-6">
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                defaultValue={expense.description}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                placeholder="e.g. Groceries, Rent"
                            />
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                                Amount ($)
                            </label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                defaultValue={expense.amount}
                                step="0.01"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                defaultValue={expense.category}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                            >
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Health">Health</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                                Date
                            </label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                defaultValue={new Date(expense.date).toISOString().slice(0, 16)}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all [color-scheme:dark]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            Update Expense
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
