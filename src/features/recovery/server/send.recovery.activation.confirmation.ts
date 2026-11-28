import 'server-only';

import { getTranslations } from 'next-intl/server';
import { renderNotificationEmail } from '@/features/notifications/server/notification.email';
import { sendEmail } from '@/features/notifications/server/send.email';
import { db } from '@/lib/db';

/** Sends the customer a confirmation for their paid sticker activation. */
export async function sendRecoveryActivationConfirmation(
    number: string,
    code: string,
    email: string,
) {
    const order = await db.order.findUniqueOrThrow({
        where: { number },
        select: { id: true, customerConfirmationNotifiedAt: true },
    });
    if (order.customerConfirmationNotifiedAt) return;

    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error('Activation confirmation URL is not configured');
    const url = new URL(`/recovery/${encodeURIComponent(code)}`, appUrl).toString();
    const [t, tEmail] = await Promise.all([
        getTranslations({ locale: 'en', namespace: 'recovery.activationEmail' }),
        getTranslations({ locale: 'en', namespace: 'Notifications.email' }),
    ]);
    const content = await renderNotificationEmail({
        brand: tEmail('brand'),
        title: t('title'),
        introduction: t('introduction'),
        highlight: number,
        guidance: t('guidance', { url }),
        signoff: tEmail('signoff'),
        footer: tEmail('footer'),
    });
    await sendEmail(
        {
            to: email,
            subject: t('subject'),
            ...content,
            idempotencyKey: `sticker-activation/${order.id}`,
        },
        { timeoutMs: 10_000 },
    );
    const now = new Date();
    await db.order.update({
        where: { id: order.id },
        data: { customerConfirmationNotifiedAt: now, confirmationNotifiedAt: now },
        select: { id: true },
    });
}
