import "server-only";

import { CredentialsSignin } from "next-auth";
import { normalizeEmail } from "@/features/auth/utils/auth.validation";

/** Identifies email eligibility failures during sign-in without exposing provider details. */
class EmailSigninError extends CredentialsSignin {
    /** Associates a safe failure code with the rejected sign-in. */
    constructor(code: "disposable_email" | "email_check_unavailable") {
        super();
        this.code = code;
    }
}

/** Checks the sign-in email's domain against DeBounce's maintained disposable-provider database. */
export async function validateSignInEmail(email: string): Promise<void> {
    const domain = normalizeEmail(email).split("@").pop()!;
    const url = new URL("https://disposable.debounce.io/");
    url.searchParams.set("email", domain);

    let disposable: boolean;
    try {
        const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error("Email lookup failed");
        const result: unknown = await response.json();
        if (!result || typeof result !== "object" || !("disposable" in result)
            || ![true, false, "true", "false"].includes(result.disposable as boolean | string)) {
            throw new Error("Invalid email lookup response");
        }
        disposable = result.disposable === true || result.disposable === "true";
    } catch {
        throw new EmailSigninError("email_check_unavailable");
    }

    if (disposable) throw new EmailSigninError("disposable_email");
}
