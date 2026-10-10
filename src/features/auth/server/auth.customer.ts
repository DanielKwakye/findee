import "server-only";
import { db } from "@/lib/db";
import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";
import type { AuthUser } from "@/features/auth/utils/auth.types";
import { verifyPassword } from "@/features/auth/server/auth.password";

/** Resolves customer accounts using the placeholder email verification code. */
export async function authenticateCustomerOtp(credentials: Partial<Record<string, unknown>>): Promise<AuthUser | null> {
    if (typeof credentials.email !== "string" || !isValidEmail(credentials.email)
        || typeof credentials.code !== "string" || !/^\d{4}$/.test(credentials.code)) return null;
    const email = normalizeEmail(credentials.email);
    const user = await db.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, role: true, otp: true, otpCreatedAt: true },
    });
    if (!user || user.role !== "CUSTOMER" || !user.otp || !user.otpCreatedAt
        || !await verifyPassword(user.otp, credentials.code)) return null;
    const consumed = await db.user.updateMany({
        where: { id: user.id, role: "CUSTOMER", otp: user.otp, otpCreatedAt: user.otpCreatedAt },
        data: { otp: null, otpCreatedAt: null },
    });
    if (consumed.count !== 1) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
}
