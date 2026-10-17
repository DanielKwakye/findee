import "server-only";

import { Resend } from "resend";

type EmailNotification = {
    to: string | string[];
    subject: string;
    replyTo?: string | string[];
    idempotencyKey?: string;
} & ({ text: string; html?: string } | { html: string; text?: string });

type EmailDeliveryOptions = { minIntervalMs?: number; rateLimitRetries?: number; deadline?: number; timeoutMs?: number };
let nextEmailAt = 0;

/** Delivers transactional emails from the application's verified sender. */
export async function sendEmail({ idempotencyKey, ...message }: EmailNotification, options: EmailDeliveryOptions = {}) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;
    if (!apiKey || !fromEmail) throw new Error("Email delivery is not configured.");
    const resend = new Resend(apiKey);
    for (let attempt = 0; attempt <= (options.rateLimitRetries ?? 0); attempt++) {
        // Reserve a send slot before waiting so concurrent recipients are spaced within this process.
        const sendAt = options.minIntervalMs ? Math.max(Date.now(), nextEmailAt) : Date.now();
        if (options.deadline && sendAt >= options.deadline) throw new Error("Email delivery time budget reached");
        if (options.minIntervalMs) nextEmailAt = sendAt + options.minIntervalMs;
        if (sendAt > Date.now()) await new Promise(resolve => setTimeout(resolve, sendAt - Date.now()));
        if (options.deadline && Date.now() >= options.deadline) throw new Error("Email delivery time budget reached");
        const timeoutMs = Math.min(options.timeoutMs ?? Infinity, options.deadline ? options.deadline - Date.now() : Infinity);
        const { data, error, headers } = await resend.emails.send(
            { ...message, from: `Findmus <${fromEmail}>` },
            { idempotencyKey, signal: Number.isFinite(timeoutMs) ? AbortSignal.timeout(Math.max(1, timeoutMs)) : undefined },
        );
        if (error) {
            if (error.statusCode === 429 && error.name === "rate_limit_exceeded") {
                // Follow the provider's retry window; long delays are left for a later batch.
                const retryAfter = Number(headers?.["retry-after"] ?? headers?.["ratelimit-reset"] ?? 1);
                const delayMs = Math.max(1_000, Number.isFinite(retryAfter) ? retryAfter * 1_000 : 1_000);
                if (options.minIntervalMs) nextEmailAt = Math.max(nextEmailAt, Date.now() + delayMs);
                if (attempt < (options.rateLimitRetries ?? 0) && delayMs <= 30_000
                    && (!options.deadline || Date.now() + delayMs < options.deadline)) {
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    continue;
                }
            }
            throw new Error("Email delivery failed.", { cause: error });
        }
        if (!data) throw new Error("Email delivery returned no confirmation.");
        return data;
    }
    throw new Error("Email delivery failed.");
}
