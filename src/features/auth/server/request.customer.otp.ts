"use server";

import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";
import { db } from "@/lib/db";
import { generateOtpCode } from "@/features/auth/utils/auth.otp";
import { hashPassword } from "@/features/auth/server/auth.password";

/** Validates the customer email for the placeholder verification flow. */
export async function requestCustomerOtp(email: string) {
    if (typeof email !== "string" || !isValidEmail(email)) throw new Error("emailInvalid");
    const normalizedEmail = normalizeEmail(email);
    const user = await db.user.upsert({
        where: { email: normalizedEmail },
        create: { email: normalizedEmail, role: "CUSTOMER" },
        update: {},
        select: { role: true },
    });
    if (user.role !== "CUSTOMER") throw new Error("verificationFailed");
    const code = generateOtpCode();
    const otp = await hashPassword(code);
    const updated = await db.user.updateMany({
        where: { email: normalizedEmail, role: "CUSTOMER" },
        data: { otp, otpCreatedAt: new Date() },
    });
    if (updated.count !== 1) throw new Error("verificationFailed");
    console.log("Customer verification code:", { email: normalizedEmail, code });
    return { email: normalizedEmail };
}
