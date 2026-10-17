"use server";

import { randomUUID } from "node:crypto";
import { getTranslations } from "next-intl/server";
import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";
import { db } from "@/lib/db";
import { generateOtpCode } from "@/features/auth/utils/auth.otp";
import { hashPassword } from "@/features/auth/server/auth.password";
import { sendEmail } from "@/features/notifications/server/send.email";
import { renderNotificationEmail } from "@/features/notifications/server/notification.email";

/** Validates the customer email for the placeholder verification flow. */
export async function requestCustomerOtp(email: string) {
    if (typeof email !== "string" || !isValidEmail(email)) throw new Error("emailInvalid");
    const normalizedEmail = normalizeEmail(email);
    const user = await db.user.upsert({
        where: { email: normalizedEmail },
        create: { email: normalizedEmail, role: "CUSTOMER" },
        update: {},
        select: { role: true, closedAt: true },
    });
    if (user.role !== "CUSTOMER" || user.closedAt) throw new Error("verificationFailed");
    const code = generateOtpCode();
    const otp = await hashPassword(code);
    const updated = await db.user.updateMany({
        where: { email: normalizedEmail, role: "CUSTOMER", OR: [{ closedAt: null }, { closedAt: { isSet: false } }] },
        data: { otp, otpCreatedAt: new Date() },
    });
    if (updated.count !== 1) throw new Error("verificationFailed");
    const t = await getTranslations("Auth.customerOtp.emailMessage");
    const tEmail = await getTranslations("Notifications.email");
    const content = await renderNotificationEmail({
        brand: tEmail("brand"),
        title: t("title"),
        introduction: t("introduction"),
        highlight: code,
        guidance: t("guidance"),
        signoff: tEmail("signoff"),
        footer: tEmail("footer"),
    });
    await sendEmail({
        to: normalizedEmail,
        subject: t("subject"),
        ...content,
        idempotencyKey: `customer-otp/${randomUUID()}`,
    });
    return { email: normalizedEmail };
}
