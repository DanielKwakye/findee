import "dotenv/config";
import { Prisma, PrismaClient } from "@/generated/client";
import { hashPassword } from "@/features/auth/server/auth.password";
import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";

/** Provisions the initial administrator without resetting an existing account. */
async function seed() {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !isValidEmail(email) || !password) throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required.");
    const db = new PrismaClient();
    try {
        await db.user.upsert({
            where: { email: normalizeEmail(email) },
            create: { email: normalizeEmail(email), passwordHash: await hashPassword(password), role: "ADMIN" },
            update: {},
        });
        console.log("Admin seed complete; existing account credentials are preserved.");
    } finally {
        await db.$disconnect();
    }
}

seed().catch((error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2031") {
        console.error("Admin seed failed: MongoDB must run as a replica set for Prisma writes.");
    } else {
        console.error("Admin seed failed. Check the database connection and seed configuration.");
    }
    process.exitCode = 1;
});
