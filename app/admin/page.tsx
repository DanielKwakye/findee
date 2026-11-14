import { requireAdmin } from '@/features/auth/server/auth.session';
import { randomInt } from 'node:crypto';
import type { Metadata } from 'next';
import messages from '@/translations/en.json';
import { AdminWelcome } from '@/components/platform';

export const metadata: Metadata = { title: messages.PageMetadata.titles.adminWelcome };

/** Routes authorized administrators to the current portal landing page. */
export default async function AdminPage() {
    const user = await requireAdmin();
    const quoteKeys = Object.keys(messages.AdminWelcome.quotes);
    const quoteKey = quoteKeys[randomInt(quoteKeys.length)];
    return <AdminWelcome name={user.name} quoteKey={quoteKey} departments={user.departments} />;
}
