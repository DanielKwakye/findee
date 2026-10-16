import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import juice from "juice";
import { getTranslations } from "next-intl/server";
import { render, toPlainText } from "react-email";
import NotificationEmail from "@/features/notifications/components/ui/notification-email";
import type { NotificationEmailContent } from "@/features/notifications/utils/notification.email.type";

/** Formats transactional notifications with a shared layout and plain-text alternative. */
export async function renderNotificationEmail(content: NotificationEmailContent) {
    const t = await getTranslations("Footer");
    const css = await readFile(join(process.cwd(), "src/features/notifications/components/ui/notification-email.module.css"), "utf8");
    const html = juice(await render(NotificationEmail({
        footerTagline: t("tagline"),
        footerDescription: t("description"),
        ...content,
    })), { extraCss: css });
    return { html, text: toPlainText(html) };
}
