import RecoveryDetails from '@/features/recovery/components/ui/recovery-details';
import type { Metadata } from 'next';
import messages from '@/translations/en.json';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AppIcon } from '@/components/platform';
import { getCustomerUser } from '@/features/auth/server/auth.session';

export const metadata: Metadata = { title: messages.PageMetadata.titles.recovery };

/** Provides the unauthenticated recovery page for a sticker's unique code. */
export default async function RecoveryPage({
    params,
    searchParams,
}: {
    params: Promise<{ code: string }>;
    searchParams: Promise<{ session_id?: string | string[] }>;
}) {
    const { code } = await params;
    const { session_id: sessionId } = await searchParams;
    if (typeof sessionId === 'string' && sessionId.startsWith('cs_'))
        redirect(`/checkout/order-received?session_id=${encodeURIComponent(sessionId)}`);
    const [t, customer] = await Promise.all([getTranslations('recovery'), getCustomerUser()]);
    return (
        <div
            className="relative isolate flex min-h-dvh flex-col overflow-hidden"
            style={{
                backgroundColor: 'color-mix(in oklch, var(--chart-5) 22%, var(--foreground))',
            }}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-10"
                style={{
                    backgroundImage:
                        'linear-gradient(color-mix(in oklch, var(--chart-2) 40%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--chart-2) 40%, transparent) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }}
            />
            <header className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8">
                <Link
                    href="/"
                    prefetch={false}
                    aria-label={t('home')}
                    className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                    <AppIcon brightness="light" size="compact" />
                </Link>
            </header>
            <main className="flex flex-1 items-center justify-center px-5 pt-4 pb-16 sm:px-8 sm:pb-24">
                <RecoveryDetails
                    code={code}
                    customer={
                        customer
                            ? { email: customer.email, name: customer.name, phone: customer.phone }
                            : null
                    }
                />
            </main>
        </div>
    );
}
