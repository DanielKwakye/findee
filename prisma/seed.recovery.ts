import "dotenv/config";
import {Prisma, PrismaClient} from "@/generated/client";

const fixtures = [
    {code: "DEV-REC-001", variant: "Everyday", published: true, assigned: true, phone: true, email: true, expected: "Owner, email and phone"},
    {code: "DEV-REC-002", variant: "Fabric", published: true, assigned: true, phone: false, email: true, expected: "Owner and email; phone hidden"},
    {code: "DEV-REC-003", variant: "Tough", published: true, assigned: true, phone: false, email: false, expected: "Owner; no contact methods available"},
    {code: "DEV-REC-004", variant: "Everyday", published: false, assigned: true, phone: true, email: true, expected: "No record found"},
    {code: "DEV-REC-005", variant: "Everyday", published: true, assigned: false, phone: true, email: true, expected: "No record found"},
];

/** Provisions repeatable owner and sticker fixtures for manually reviewing public recovery behavior. */
async function seedRecovery() {
    const db = new PrismaClient();
    try {
        await db.$transaction(async transaction => {
            const owner = await transaction.user.upsert({
                where: {email: "recovery-owner@example.test"},
                create: {email: "recovery-owner@example.test", name: "Recovery Test Owner", phone: "+1 202-555-0147", passwordHash: null, role: "CUSTOMER"},
                update: {name: "Recovery Test Owner", phone: "+1 202-555-0147"},
            });
            const existing = await transaction.product.findMany({
                where: {code: {in: fixtures.map(fixture => fixture.code)}},
                select: {reservedById: true},
            });
            if (existing.some(product => product.reservedById !== owner.id)) {
                throw new Error("A recovery fixture code is already used by another product.");
            }
            const now = new Date();
            for (const fixture of fixtures) {
                const data = {
                    variant: fixture.variant,
                    published: fixture.published,
                    procurementStatus: "inactive" as const,
                    reservedById: owner.id,
                    reservedAt: now,
                    assignedToId: fixture.assigned ? owner.id : null,
                    assignedAt: fixture.assigned ? now : null,
                    reachoutModes: {phone: fixture.phone, email: fixture.email, chat: false},
                };
                await transaction.product.upsert({
                    where: {code: fixture.code},
                    create: {code: fixture.code, ...data},
                    update: data,
                });
            }
        });
        console.log("Recovery fixtures ready. Open these paths without signing in:");
        console.table(fixtures.map(fixture => ({path: `/recovery/${fixture.code}`, expected: fixture.expected})));
        console.log("Case check: /recovery/dev-rec-001 and /recovery/Dev-Rec-001 should match /recovery/DEV-REC-001.");
        console.log("Unknown-code check: use a code absent from your database; it should show no record found.");
    } finally {
        await db.$disconnect();
    }
}

seedRecovery().catch((error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2031") {
        console.error("Recovery seed failed: MongoDB must run as a replica set for Prisma writes.");
    } else {
        console.error("Recovery seed failed. Check database connectivity and whether fixture codes belong to other products.");
    }
    process.exitCode = 1;
});
