import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"
import { prisma } from "@/lib/prisma"
import { updateIncome } from "@/app/actions/transaction"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditIncomePage({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const income = await prisma.income.findUnique({
        where: { id: params.id, userId: session.user.id! },
    })

    if (!income) redirect("/dashboard")

    const updateIncomeWithId = updateIncome.bind(null, income.id)

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar user={session.user} />

            <main className="max-w-2xl mx-auto px-4 py-8">
                <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h1 className="text-2xl font-bold mb-6">Edit Income</h1>

                    <form action={updateIncomeWithId} className="space-y-6">
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                defaultValue={income.description}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                placeholder="e.g. Salary, Freelance"
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
                                defaultValue={income.amount}
                                step="0.01"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                                Date
                            </label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                defaultValue={new Date(income.date).toISOString().slice(0, 16)}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all [color-scheme:dark]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            Update Income
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
