import { ReactNode } from 'react';
import { requireCustomer } from '@/features/auth/server/auth.session';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/core/ui/sidebar';
import { Separator } from '@/components/core/ui/separator';
import { PortalSidebar, PortalBreadcrumb } from '@/components/platform';
import PortalVisitTracker from '@/features/auth/components/ui/portal-visit-tracker';
import PortalSessionGuard from '@/features/auth/components/ui/portal-session-guard';
import type { Metadata } from 'next';
import messages from '@/translations/en.json';
import { shareLinks } from '@/components/platform/data/share';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
    title: {
        default: messages.PageMetadata.customerDefaultTitle,
        template: messages.PageMetadata.customerTitleTemplate,
    },
};

/** Provides the authorized customer's portal layout. */
export default async function CustomerLayout({ children }: { children: ReactNode }) {
    const user = await requireCustomer();
    return (
        <SidebarProvider>
            <PortalSessionGuard key={user.id} role="CUSTOMER" />
            <PortalVisitTracker key={`visit-${user.id}`} role="CUSTOMER" />
            <PortalSidebar
                user={user}
                audience="customer"
                shareLinks={shareLinks}
                reviewLink={
                    (user.reviewRequestCount ?? 0) > 0
                        ? process.env.TRUST_PILOT_REVIEW_LINK
                        : undefined
                }
            />
            <SidebarInset className="min-w-0">
                <header className="sticky top-0 z-20 flex min-h-16 shrink-0 items-center gap-2 bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-12">
                    <div className="flex min-w-0 items-center gap-2 px-4 py-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-vertical:h-4 data-vertical:self-center"
                        />
                        <PortalBreadcrumb />
                    </div>
                </header>
                <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
