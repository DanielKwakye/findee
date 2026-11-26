import 'server-only';

import { after } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { sendEmail } from '@/features/notifications/server/send.email';

type Celebration =
    | { type: 'signup'; customerId: string; email: string }
    | { type: 'payment'; orderNumber: string };

/** Schedules an internal celebration email after the current response. */
export function scheduleCelebrationEmail(celebration: Celebration) {
    const to = process.env.SUPPORT_EMAIL?.trim();
    if (!to) return;

    after(async () => {
        try {
            const t = await getTranslations('Notifications.celebration');
            const { type } = celebration;
            const text =
                type === 'signup'
                    ? t('signup.message', { email: celebration.email })
                    : t('payment.message', { number: celebration.orderNumber });
            const reference = type === 'signup' ? celebration.customerId : celebration.orderNumber;
            await sendEmail(
                {
                    to,
                    subject: t(`${type}.subject`),
                    text,
                    idempotencyKey: `celebration/${type}/${reference}`,
                },
                { timeoutMs: 5_000 },
            );
        } catch {
            console.error('Internal celebration email failed', { type: celebration.type });
        }
    });
}
