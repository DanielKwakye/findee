import "server-only";

import { Resend } from "resend";

type EmailNotification = {
    to: string | string[];
    subject: string;
    replyTo?: string | string[];
    idempotencyKey?: string;
} & ({ text: string; html?: string } | { html: string; text?: string });

/** Delivers transactional emails from the application's verified sender. */
export async function sendEmail({ idempotencyKey, ...message }: EmailNotification) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("Email delivery is not configured.");
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send(
        { ...message, from: "Findmus <noreply@findmus.com>" },
        idempotencyKey ? { idempotencyKey } : undefined,
    );
    if (error) throw new Error("Email delivery failed.", { cause: error });
    if (!data) throw new Error("Email delivery returned no confirmation.");
    return data;
}
