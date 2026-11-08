import 'server-only';

import { getTranslations } from 'next-intl/server';
import { isValidEmail } from '@/features/auth/utils/auth.validation';
import { renderNotificationEmail } from '@/features/notifications/server/notification.email';
import { sendEmail } from '@/features/notifications/server/send.email';
import { db } from '@/lib/db';

/** Sends a branded review request and triggers Trustpilot's BCC invitation flow. */
export async function sendReviewRequest(customer: {
    id: string;
    name: string | null;
    email: string;
}) {
    const from = process.env.SUPPORT_EMAIL?.trim();
    const bcc = process.env.TRUST_PILOT_EMAIL?.trim();
    const reviewLink = process.env.TRUST_PILOT_REVIEW_LINK?.trim();
    if (!from || !bcc || !isValidEmail(from) || !isValidEmail(bcc))
        throw new Error('Review request email is not configured');
    if (!reviewLink || new URL(reviewLink).protocol !== 'https:')
        throw new Error('Trustpilot review link is not configured');
    if (!isValidEmail(customer.email)) throw new Error('Invalid review recipient');
    const t = await getTranslations('ReviewRequestEmail');
    const content = await renderNotificationEmail({
        brand: t('brand'),
        title: t('title'),
        introduction: t('introduction', { name: customer.name?.trim() || t('customer') }),
        guidance: t('guidance'),
        link: { href: reviewLink, label: t('reviewLink') },
        signoff: t('signoff'),
        footer: t('footer'),
    });
    const result = await sendEmail({
        to: customer.email,
        from,
        bcc,
        replyTo: from,
        subject: t('subject'),
        ...content,
    });
    await db.user.updateMany({
        where: {
            id: customer.id,
            OR: [{ reviewRequestCount: { isSet: false } }, { reviewRequestCount: null }],
        },
        data: { reviewRequestCount: 0 },
    });
    await db.user.update({
        where: { id: customer.id },
        data: { reviewRequestCount: { increment: 1 } },
        select: { id: true },
    });
    return result;
}
