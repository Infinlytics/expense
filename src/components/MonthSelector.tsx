"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function MonthSelector() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentMonth = searchParams.get("month") ? parseInt(searchParams.get("month")!) : new Date().getMonth()
    const currentYear = searchParams.get("year") ? parseInt(searchParams.get("year")!) : new Date().getFullYear()

    const date = new Date(currentYear, currentMonth)

    const handlePrevMonth = () => {
        const newDate = new Date(currentYear, currentMonth - 1)
        updateParams(newDate)
    }

    const handleNextMonth = () => {
        const newDate = new Date(currentYear, currentMonth + 1)
        updateParams(newDate)
    }

    const updateParams = (newDate: Date) => {
        const params = new URLSearchParams(searchParams)
        params.set("month", newDate.getMonth().toString())
        params.set("year", newDate.getFullYear().toString())
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-lg border border-white/10">
            <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
            >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <span className="font-medium text-white min-w-[140px] text-center">
                {date.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
            >
                <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
        </div>
    )
}
