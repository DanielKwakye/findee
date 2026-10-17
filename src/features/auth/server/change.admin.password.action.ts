"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/server/auth.session";
import { hashPassword, verifyPassword } from "@/features/auth/server/auth.password";
import type { ChangeAdminPasswordValues } from "@/features/auth/utils/auth.types";
import { db } from "@/lib/db";

/** Replaces an administrator's temporary credentials with their chosen password. */
export async function changeAdminPassword(values: ChangeAdminPasswordValues) {
    const user = await requireAdmin({ allowPasswordChange: true });
    if (!values || typeof values.password !== "string" || values.password.length < 8 || values.password.length > 1024
        || values.password !== values.confirmPassword) return { error: "invalid" as const };
    const account = await db.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
    if (!account?.passwordHash) throw new Error("Administrator account not found");
    if (await verifyPassword(account.passwordHash, values.password)) return { error: "samePassword" as const };
    const passwordHash = await hashPassword(values.password);
    const updated = await db.user.updateMany({
        where: { id: user.id, role: "ADMIN", passwordHash: account.passwordHash },
        data: { passwordHash, mustChangePassword: false },
    });
    if (updated.count !== 1) throw new Error("Password change failed");
    revalidatePath("/admin", "layout");
    revalidatePath("/change-password");
    return { error: null };
}
