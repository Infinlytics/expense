'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function register(prevState: string | undefined, formData: FormData) {
    const result = RegisterSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!result.success) {
        return "Invalid input"
    }

    const { email, password, name } = result.data

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return "Email already exists"
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        // await signIn("credentials", { email, password, redirectTo: "/dashboard" })
        // We can't sign in directly here easily without redirecting, so we'll just return success
        // and let the client redirect to login or auto-login.
        // Actually, signIn throws a redirect error, so we can use it if we want.

    } catch (error) {
        if (error instanceof AuthError) {
            return "Something went wrong"
        }
        throw error
    }
}
