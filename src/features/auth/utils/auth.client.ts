"use client";

import { signIn, signOut } from "next-auth/react";
import type { LoginValues } from "@/features/auth/utils/auth.types";

/** Submits credentials through Auth.js and classifies safe login failures. */
export async function login(values: LoginValues) {
    const result = await signIn("credentials", { ...values, redirect: false, redirectTo: "/admin" });
    if (!result || result.error || !result.ok || !result.url) {
        if (result?.code === "bot_check_failed") throw new Error("botCheckFailed");
        if (result?.code === "disposable_email") throw new Error("disposableEmail");
        if (result?.code === "email_check_unavailable") throw new Error("emailCheckUnavailable");
        throw new Error(result?.code === "rate_limited" ? "rateLimited" : result?.error === "CredentialsSignin" ? "invalidCredentials" : "serverError");
    }
    return result.url;
}

/** Ends the current Auth.js session and returns to the sign-in page. */
export async function logout() {
    await signOut({ redirectTo: "/" }); // redirectTo home page. you could use /login
}
