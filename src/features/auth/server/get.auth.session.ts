"use server";

import { auth } from "@/features/auth/utils/auth";

/** Reports whether the current visitor has an authenticated session. */
export async function getAuthSession() {
    const session = await auth();
    return { isAuthenticated: !!session?.user?.id };
}
