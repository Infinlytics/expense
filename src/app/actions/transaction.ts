'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const TransactionSchema = z.object({
    amount: z.coerce.number().positive("Amount must be positive"),
    description: z.string().min(1, "Description is required"),
    date: z.coerce.date(),
    category: z.string().optional(), // Only for expense
})

export async function addIncome(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const result = TransactionSchema.safeParse({
        amount: formData.get("amount"),
        description: formData.get("description"),
        date: formData.get("date"),
    })

    if (!result.success) {
        return { error: "Invalid input" }
    }

    const { amount, description, date } = result.data

    try {
        await prisma.income.create({
            data: {
                amount,
                description,
                date,
                userId: session.user.id,
            },
        })
    } catch (error) {
        return { error: "Failed to add income" }
    }

    revalidatePath("/dashboard")
    redirect("/dashboard")
}

export async function addExpense(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const result = TransactionSchema.extend({
        category: z.string().min(1, "Category is required"),
    }).safeParse({
        amount: formData.get("amount"),
        description: formData.get("description"),
        date: formData.get("date"),
        category: formData.get("category"),
    })

    if (!result.success) {
        return { error: "Invalid input" }
    }

    const { amount, description, date, category } = result.data

    try {
        await prisma.expense.create({
            data: {
                amount,
                description,
                date,
                category: category!,
                userId: session.user.id,
            },
        })
    } catch (error) {
        return { error: "Failed to add expense" }
    }

    revalidatePath("/dashboard")
    redirect("/dashboard")
}

export async function updateIncome(id: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const result = TransactionSchema.safeParse({
        amount: formData.get("amount"),
        description: formData.get("description"),
        date: formData.get("date"),
    })

    if (!result.success) {
        throw new Error("Invalid input")
    }

    const { amount, description, date } = result.data

    try {
        await prisma.income.update({
            where: { id, userId: session.user.id },
            data: { amount, description, date },
        })
    } catch (error) {
        throw new Error("Failed to update income")
    }

    revalidatePath("/dashboard")
    redirect("/dashboard")
}

export async function updateExpense(id: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const result = TransactionSchema.extend({
        category: z.string().min(1, "Category is required"),
    }).safeParse({
        amount: formData.get("amount"),
        description: formData.get("description"),
        date: formData.get("date"),
        category: formData.get("category"),
    })

    if (!result.success) {
        throw new Error("Invalid input")
    }

    const { amount, description, date, category } = result.data

    try {
        await prisma.expense.update({
            where: { id, userId: session.user.id },
            data: { amount, description, date, category: category! },
        })
    } catch (error) {
        throw new Error("Failed to update expense")
    }

    revalidatePath("/dashboard")
    redirect("/dashboard")
}
