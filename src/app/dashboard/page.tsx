import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"
import { prisma } from "@/lib/prisma"
import { Plus, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"
import Link from "next/link"
import { Income, Expense } from "@prisma/client"

async function getDashboardData(userId: string) {
    try {
        const [incomes, expenses] = await Promise.all([
            prisma.income.findMany({ where: { userId } }),
            prisma.expense.findMany({ where: { userId } }),
        ])

        const totalIncome = incomes.reduce((acc: number, curr: Income) => acc + curr.amount, 0)
        const totalExpense = expenses.reduce((acc: number, curr: Expense) => acc + curr.amount, 0)
        const balance = totalIncome - totalExpense

        return { totalIncome, totalExpense, balance, recentTransactions: [] } // TODO: Merge and sort transactions
    } catch (error) {
        console.error("Failed to fetch data:", error)
        return { totalIncome: 0, totalExpense: 0, balance: 0, recentTransactions: [] }
    }
}

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const data = await getDashboardData(session.user.id!)

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar user={session.user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-blue-100 font-medium">Total Balance</h3>
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white">${data.balance.toFixed(2)}</p>
                    </div>

                    {/* Income Card */}
                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-emerald-100 font-medium">Total Income</h3>
                            <div className="p-2 bg-white/10 rounded-lg">
                                <ArrowUpRight className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white">${data.totalIncome.toFixed(2)}</p>
                    </div>

                    {/* Expense Card */}
                    <div className="bg-gradient-to-br from-rose-600 to-rose-800 rounded-2xl p-6 shadow-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-rose-100 font-medium">Total Expenses</h3>
                            <div className="p-2 bg-white/10 rounded-lg">
                                <ArrowDownRight className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white">${data.totalExpense.toFixed(2)}</p>
                    </div>
                </div>

                {/* Actions & Recent Transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1 space-y-4">
                        <Link href="/dashboard/add-income" className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 transition-all group">
                            <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                                <Plus className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="font-medium text-gray-200">Add Income</span>
                        </Link>
                        <Link href="/dashboard/add-expense" className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 transition-all group">
                            <div className="p-2 bg-rose-500/20 rounded-lg group-hover:bg-rose-500/30 transition-colors">
                                <Plus className="w-5 h-5 text-rose-400" />
                            </div>
                            <span className="font-medium text-gray-200">Add Expense</span>
                        </Link>
                    </div>

                    {/* Recent Transactions */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                        <div className="text-center py-8 text-gray-400">
                            No transactions yet.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
