import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"
import { prisma } from "@/lib/prisma"
import { Plus, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"
import Link from "next/link"
import { Income, Expense } from "@prisma/client"
import MonthSelector from "@/components/MonthSelector"

async function getDashboardData(userId: string, month: number, year: number) {
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0, 23, 59, 59)

    try {
        const [incomes, expenses] = await Promise.all([
            prisma.income.findMany({
                where: {
                    userId,
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                orderBy: { date: 'desc' }
            }),
            prisma.expense.findMany({
                where: {
                    userId,
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                orderBy: { date: 'desc' }
            }),
        ])

        const totalIncome = incomes.reduce((acc: number, curr: Income) => acc + curr.amount, 0)
        const totalExpense = expenses.reduce((acc: number, curr: Expense) => acc + curr.amount, 0)
        const balance = totalIncome - totalExpense

        // Merge and sort transactions
        const transactions = [
            ...incomes.map(i => ({ ...i, type: 'income' as const })),
            ...expenses.map(e => ({ ...e, type: 'expense' as const }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        return { totalIncome, totalExpense, balance, recentTransactions: transactions }
    } catch (error) {
        console.error("Failed to fetch data:", error)
        return { totalIncome: 0, totalExpense: 0, balance: 0, recentTransactions: [] }
    }
}

export default async function DashboardPage({ searchParams }: { searchParams: { month?: string, year?: string } }) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const month = searchParams.month ? parseInt(searchParams.month) : new Date().getMonth()
    const year = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear()

    const data = await getDashboardData(session.user.id!, month, year)

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar user={session.user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-bold">Dashboard</h2>
                    <MonthSelector />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-blue-100 font-medium">Balance</h3>
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white">${data.balance.toFixed(2)}</p>
                    </div>

                    {/* Income Card */}
                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-emerald-100 font-medium">Income</h3>
                            <div className="p-2 bg-white/10 rounded-lg">
                                <ArrowUpRight className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white">${data.totalIncome.toFixed(2)}</p>
                    </div>

                    {/* Expense Card */}
                    <div className="bg-gradient-to-br from-rose-600 to-rose-800 rounded-2xl p-6 shadow-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-rose-100 font-medium">Expenses</h3>
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
                        {data.recentTransactions.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                No transactions for this month.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.recentTransactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{t.description}</p>
                                                <p className="text-sm text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                            </span>
                                            <Link href={`/dashboard/edit-${t.type}/${t.id}`} className="text-sm text-blue-400 hover:text-blue-300">
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
