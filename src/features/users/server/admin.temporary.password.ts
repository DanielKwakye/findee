import 'server-only';

import { generateReferenceCode } from '@/components/platform/utils/reference.code.utils';
import { hashPassword } from '@/features/auth/server/auth.password';
import { renderNotificationEmail } from '@/features/notifications/server/notification.email';
import { getTranslations } from 'next-intl/server';

/** Prepares temporary administrator credentials and the email that delivers them. */
export async function prepareAdminTemporaryPassword(
    email: string,
    purpose: 'AdminInvitation' | 'AdminPasswordReset' = 'AdminInvitation',
) {
    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error('APP_URL is not configured');
    const loginUrl = new URL('/login', appUrl);
    if (!['https:', 'http:'].includes(loginUrl.protocol)) throw new Error('Invalid APP_URL');
    const password = `${generateReferenceCode()}-${generateReferenceCode()}`;
    const passwordHash = await hashPassword(password);
    const t = await getTranslations(purpose);
    const tEmail = await getTranslations('Notifications.email');
    const content = await renderNotificationEmail({
        brand: tEmail('brand'),
        title: t('title'),
        introduction: t('introduction', { email }),
        highlight: password,
        guidance: t('guidance', { url: loginUrl.toString() }),
        signoff: tEmail('signoff'),
        footer: tEmail('footer'),
    });
    return { passwordHash, message: { to: email, subject: t('subject'), ...content } };
}
