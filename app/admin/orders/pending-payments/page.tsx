import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/features/auth/server/auth.session';
import OrdersTable from '@/features/orders/components/ui/orders-table';
import TypographyH3 from '@/components/core/ui/typography-h3';
import messages from '@/translations/en.json';

export const metadata: Metadata = { title: messages.orders.pendingPayments };

/** Presents orders awaiting customer payment for administrator review. */
export default async function PendingPaymentsPage() {
    await requireAdmin();
    const t = await getTranslations('orders');
    return (
        <>
            <TypographyH3>{t('pendingPayments')}</TypographyH3>
            <OrdersTable status="all" pendingPayments />
        </>
    );
}
