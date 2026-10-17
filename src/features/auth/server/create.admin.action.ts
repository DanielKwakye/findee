"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { hashPassword } from "@/features/auth/server/auth.password";
import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";
import { generateReferenceCode } from "@/components/platform/utils/reference.code.utils";
import { getTranslations } from "next-intl/server";
import { renderNotificationEmail } from "@/features/notifications/server/notification.email";
import { sendEmail } from "@/features/notifications/server/send.email";
import type { AddAdminValues } from "@/features/auth/utils/auth.types";
import { db } from "@/lib/db";

/** Creates a new administrator account for an authorized administrator. */
export async function createAdmin(values: AddAdminValues) {
    await requireAdmin();
    if (!values || typeof values.email !== "string" || !isValidEmail(values.email)
        || typeof values.name !== "string" || values.name.trim().length > 100) {
        return { error: "invalid" as const };
    }
    const email = normalizeEmail(values.email);
    if (await db.user.findUnique({ where: { email }, select: { id: true } })) return { error: "duplicate" as const };
    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error("APP_URL is not configured");
    const loginUrl = new URL("/login", appUrl);
    if (!["https:", "http:"].includes(loginUrl.protocol)) throw new Error("Invalid APP_URL");
    const password = `${generateReferenceCode()}-${generateReferenceCode()}`;
    const passwordHash = await hashPassword(password);
    const t = await getTranslations("AdminInvitation");
    const tEmail = await getTranslations("Notifications.email");
    const content = await renderNotificationEmail({
        brand: tEmail("brand"), title: t("title"), introduction: t("introduction", { email }),
        highlight: password, guidance: t("guidance", { url: loginUrl.toString() }),
        signoff: tEmail("signoff"), footer: tEmail("footer"),
    });
    let admin;
    try {
        admin = await db.user.create({
            data: { email, name: values.name.trim() || null, passwordHash, role: "ADMIN", mustChangePassword: true },
            select: { id: true },
        });
    } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
            return { error: "duplicate" as const };
        }
        throw error;
    }
    try {
        await sendEmail({ to: email, subject: t("subject"), ...content, idempotencyKey: `admin-invitation/${admin.id}` });
    } catch {
        await db.user.deleteMany({ where: { id: admin.id, mustChangePassword: true, passwordHash } });
        return { error: "delivery" as const };
    }
    return { error: null };
}
