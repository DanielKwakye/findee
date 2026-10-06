"use client";

import { signIn, signOut } from "next-auth/react";
import type { LoginValues } from "@/features/auth/utils/auth.types";

/** Submits credentials through Auth.js and classifies safe login failures. */
export async function login(values: LoginValues) {
    const result = await signIn("credentials", { ...values, redirect: false, redirectTo: "/login" });
    if (!result || result.error || !result.ok || !result.url) {
        throw new Error(result?.code === "rate_limited" ? "rateLimited" : result?.error === "CredentialsSignin" ? "invalidCredentials" : "serverError");
    }
    return result.url;
}

/** Ends the current Auth.js session and returns to the sign-in page. */
export async function logout() {
    await signOut({ redirectTo: "/" }); // redirectTo home page. you could use /login
}
