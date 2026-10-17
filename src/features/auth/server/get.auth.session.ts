"use server";

import { getAuthenticatedUser } from "@/features/auth/server/auth.session";

/** Reports whether the current visitor has an authenticated session. */
export async function getAuthSession() {
    const user = await getAuthenticatedUser();
    return { isAuthenticated: !!user, role: user?.role ?? null };
}
