import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/utils/auth";
import { db } from "@/lib/db";

/** Resolves a verified session to the current database account and role. */
export const getAuthenticatedUser = cache(async () => {
    const session = await auth();
    if (!session?.user?.id || !/^[a-f\d]{24}$/i.test(session.user.id)) return null;
    return db.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, email: true, name: true, phone: true, role: true },
    });
});

/** Resolves the signed-in administrator against current database permissions. */
export const getAdminUser = cache(async () => {
    const user = await getAuthenticatedUser();
    return user?.role === "ADMIN" ? user : null;
});

/** Requires administrator access at protected pages and server operation boundaries. */
export async function requireAdmin() {
    const user = await getAdminUser();
    if (!user) redirect("/login");
    return user;
}

/** Resolves the signed-in customer against current database permissions. */
export const getCustomerUser = cache(async () => {
    const user = await getAuthenticatedUser();
    return user?.role === "CUSTOMER" ? user : null;
});

/** Requires customer access at protected pages and server operation boundaries. */
export async function requireCustomer() {
    const user = await getCustomerUser();
    if (!user) redirect("/login");
    return user;
}
