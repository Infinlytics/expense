import Link from "next/link"
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react"

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 text-white selection:bg-purple-500/30">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-gray-900 z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                            Master Your Money
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            Track expenses, visualize income, and take control of your financial future with our premium, secure, and intuitive expense tracker.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all flex items-center justify-center"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                            <BarChart3 className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Smart Analytics</h3>
                        <p className="text-gray-400">Visualize your spending habits with beautiful charts and detailed insights.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-colors">
                        <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6">
                            <Zap className="w-6 h-6 text-pink-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Real-time Tracking</h3>
                        <p className="text-gray-400">Add transactions instantly and see your balance update in real-time.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors">
                        <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                        <p className="text-gray-400">Your financial data is encrypted and stored securely. You are in control.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
