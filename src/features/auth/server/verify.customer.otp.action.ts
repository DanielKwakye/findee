"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "@/features/auth/utils/auth";
import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";
import type { CustomerOtpValues } from "@/features/auth/utils/auth.types";

/** Verifies a customer code and establishes the existing Auth.js session. */
export async function verifyCustomerOtp(values: CustomerOtpValues) {
    if (!values || typeof values.email !== "string" || !isValidEmail(values.email)) return { error: "emailInvalid" as const };
    if (typeof values.code !== "string" || !/^\d{4}$/.test(values.code)) return { error: "codeInvalid" as const };
    const email = normalizeEmail(values.email);
    try {
        await signIn("customer-otp", { email, code: values.code, redirect: false });
    } catch (error) {
        if (error instanceof CredentialsSignin && error.code === "disposable_email") return { error: "disposableEmail" as const };
        if (error instanceof CredentialsSignin && error.code === "email_check_unavailable") return { error: "emailCheckUnavailable" as const };
        if (error instanceof AuthError && error.type === "CredentialsSignin") return { error: "codeInvalid" as const };
        throw error;
    }
    return { email };
}
