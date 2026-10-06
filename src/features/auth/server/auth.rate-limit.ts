import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";

const windowMs = 15 * 60 * 1000;
const maxAttempts = 10;

/** Limits sign-in attempts across server instances using shared database counters. */
export async function allowLoginAttempt(email: string) {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const identifier = createHash("sha256").update(email).digest("hex");
    await db.loginAttempt.deleteMany({ where: { expiresAt: { lt: new Date(now) } } });
    const attempt = await db.loginAttempt.upsert({
        where: { id: `${identifier}:${windowStart}` },
        create: { id: `${identifier}:${windowStart}`, attempts: 1, expiresAt: new Date(windowStart + windowMs) },
        update: { attempts: { increment: 1 } },
    });
    return attempt.attempts <= maxAttempts;
}
