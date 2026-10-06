import type { LoginValues } from "@/features/auth/utils/auth.types";

/** Normalizes email identifiers for consistent account lookup. */
export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

/** Validates email identifiers accepted by the sign-in flow. */
export function isValidEmail(email: string) {
    return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

/** Validates credentials at the server boundary without altering passwords. */
export function parseLoginCredentials(credentials: Partial<Record<string, unknown>>): LoginValues | null {
    if (typeof credentials.email !== "string" || typeof credentials.password !== "string") return null;
    if (!isValidEmail(credentials.email) || !credentials.password.length || credentials.password.length > 1024) return null;
    return { email: normalizeEmail(credentials.email), password: credentials.password };
}
