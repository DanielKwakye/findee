import "server-only";

import { CredentialsSignin } from "next-auth";

/** Identifies failed bot checks without exposing verification details. */
class BotCheckSigninError extends CredentialsSignin {
    code = "bot_check_failed";
}

/** Verifies a single-use Turnstile token for the intended sign-in operation. */
export async function validateBotCheck(token: unknown, action: "admin-login" | "customer-otp"): Promise<void> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    const appUrl = process.env.APP_URL;
    if (!secret || !appUrl) throw new BotCheckSigninError();
    if (typeof token !== "string" || !token || token.length > 2048) throw new BotCheckSigninError();

    try {
        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secret, response: token }),
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new BotCheckSigninError();
        const result = await response.json();
        if (result?.success !== true || result.action !== action || result.hostname !== new URL(appUrl).hostname) {
            throw new BotCheckSigninError();
        }
    } catch {
        throw new BotCheckSigninError();
    }
}
