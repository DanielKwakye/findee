"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/features/auth/utils/auth";
import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";
import type { CustomerOtpValues } from "@/features/auth/utils/auth.types";

/** Verifies a customer code and establishes the existing Auth.js session. */
export async function verifyCustomerOtp(values: CustomerOtpValues) {
    if (!values || typeof values.email !== "string" || !isValidEmail(values.email)) throw new Error("emailInvalid");
    if (typeof values.code !== "string" || !/^\d{4}$/.test(values.code)) throw new Error("codeInvalid");
    const email = normalizeEmail(values.email);
    try {
        await signIn("customer-otp", { email, code: values.code, redirect: false });
    } catch (error) {
        if (error instanceof AuthError && error.type === "CredentialsSignin") throw new Error("codeInvalid");
        throw error;
    }
    return { email };
}
