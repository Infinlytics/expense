'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'

export default function Navbar({ user }: { user: any }) {
    return (
        <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            ExpenseTracker
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-300">
                            <User className="w-4 h-4" />
                            <span className="text-sm font-medium">{user?.name || user?.email}</span>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
