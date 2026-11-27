import 'server-only';
import { db } from '@/lib/db';
import { parseLoginCredentials } from '@/features/auth/utils/auth.validation';
import { hashPassword, verifyPassword } from '@/features/auth/server/auth.password';
import { allowLoginAttempt, RateLimitedSignin } from '@/features/auth/server/auth.rate-limit';
import { validateSignInEmail } from '@/features/auth/utils/auth.email';
import { validateBotCheck } from '@/features/auth/utils/auth.turnstile';
import type { AuthUser } from '@/features/auth/utils/auth.types';

let dummyHash: Promise<string> | undefined;

/** Authenticates existing accounts without exposing password hashes to sessions. */
export async function authenticateCredentials(
    credentials: Partial<Record<string, unknown>>,
): Promise<AuthUser | null> {
    const values = parseLoginCredentials(credentials);
    if (!values) return null;
    if (!(await allowLoginAttempt(values.email))) throw new RateLimitedSignin();
    await validateBotCheck(credentials.turnstileToken, 'admin-login');

    const user = await db.user.findUnique({ where: { email: values.email } });
    dummyHash ??= hashPassword('invalid-account-timing-placeholder');
    const valid = await verifyPassword(user?.passwordHash ?? (await dummyHash), values.password);
    if (!user || !user.passwordHash || !valid || user.role !== 'ADMIN') return null;

    await validateSignInEmail(user.email);
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        passwordResetVersion: user.passwordResetVersion ?? undefined,
    };
}
