import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const email = "chandraprabhudev27@gmail.com"
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" },
        })
        console.log(`Successfully updated user ${user.email} to role ${user.role}`)
    } catch (error) {
        console.error("Error updating user:", error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
