import "server-only";
import { CredentialsSignin } from "next-auth";
import { db } from "@/lib/db";
import { parseLoginCredentials } from "@/features/auth/utils/auth.validation";
import { hashPassword, verifyPassword } from "@/features/auth/server/auth.password";
import { allowLoginAttempt } from "@/features/auth/server/auth.rate-limit";
import type { AuthUser } from "@/features/auth/utils/auth.types";

/** Identifies rejected sign-in attempts that exceed the account rate limit. */
class RateLimitedSignin extends CredentialsSignin {
    code = "rate_limited";
}

let dummyHash: Promise<string> | undefined;

/** Authenticates existing accounts without exposing password hashes to sessions. */
export async function authenticateCredentials(credentials: Partial<Record<string, unknown>>): Promise<AuthUser | null> {
    const values = parseLoginCredentials(credentials);
    if (!values) return null;
    if (!await allowLoginAttempt(values.email)) throw new RateLimitedSignin();

    const user = await db.user.findUnique({ where: { email: values.email } });
    dummyHash ??= hashPassword("invalid-account-timing-placeholder");
    const valid = await verifyPassword(user?.passwordHash ?? await dummyHash, values.password);
    if (!user || !valid || user.role !== "ADMIN") return null;

    return { id: user.id, email: user.email, name: user.name, role: user.role };
}
