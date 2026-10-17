import "server-only";

import { getTranslations } from "next-intl/server";
import { getLowVariantStock } from "@/features/procurement/server/procurement.stock";
import { renderNotificationEmail } from "@/features/notifications/server/notification.email";
import { sendEmail } from "@/features/notifications/server/send.email";

/** Notifies the operations inbox of low inventory for a trusted scheduled server caller. */
export async function notifyLowVariantStock() {
    const variants = await getLowVariantStock();
    if (!variants.length) return { notified: false, variants };

    const to = process.env.ORDERS_EMAIL;
    const appUrl = process.env.APP_URL;
    if (!to || !appUrl) throw new Error("Stock notifications require ORDERS_EMAIL and APP_URL");
    const productsUrl = new URL("/admin/products", appUrl);
    if (!["https:", "http:"].includes(productsUrl.protocol)) throw new Error("Invalid APP_URL");

    const t = await getTranslations({ locale: "en", namespace: "ProcurementStock.email" });
    const tEmail = await getTranslations({ locale: "en", namespace: "Notifications.email" });
    const tVariants = await getTranslations({ locale: "en", namespace: "procurement.generation" });
    const summary = variants.map(item => t("variant", { ...item, variant: tVariants(item.variant) })).join("\n");
    const content = await renderNotificationEmail({
        brand: tEmail("brand"), title: t("title"), introduction: t("introduction"),
        guidance: t("guidance", { summary, url: productsUrl.toString() }),
        signoff: tEmail("signoff"), footer: tEmail("footer"),
    });
    await sendEmail({ to, subject: t("subject"), ...content });
    return { notified: true, variants };
}
