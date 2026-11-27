import 'server-only';
import { createHash } from 'node:crypto';
import { CredentialsSignin } from 'next-auth';
import { db } from '@/lib/db';

const windowMs = 15 * 60 * 1000;
const maxAttempts = 5;

/** Identifies rejected sign-in attempts that exceed the account rate limit. */
export class RateLimitedSignin extends CredentialsSignin {
    code = 'rate_limited';
}

/** Limits sign-in attempts across server instances using shared database counters. */
export async function allowLoginAttempt(email: string, scope?: 'customer-otp') {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const identifier = createHash('sha256')
        .update(scope ? `${scope}:${email}` : email)
        .digest('hex');
    await db.loginAttempt.deleteMany({ where: { expiresAt: { lt: new Date(now) } } });
    const attempt = await db.loginAttempt.upsert({
        where: { id: `${identifier}:${windowStart}` },
        create: {
            id: `${identifier}:${windowStart}`,
            attempts: 1,
            expiresAt: new Date(windowStart + windowMs),
        },
        update: { attempts: { increment: 1 } },
        select: { id: true, attempts: true, email: true },
    });
    if (attempt.attempts >= maxAttempts && attempt.email === null) {
        await db.loginAttempt.updateMany({ where: { id: attempt.id }, data: { email } });
    }
    return attempt.attempts <= maxAttempts;
}
