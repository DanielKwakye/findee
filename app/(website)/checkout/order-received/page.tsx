import { MobileNavbar, WebNavbar } from "@/components/platform";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import CheckoutOrder from "@/features/orders/components/ui/checkout-order";

export const metadata: Metadata = { title: messages.PageMetadata.titles.orderReceived };

/** Presents the acknowledgement for a submitted checkout. */
export default async function OrderReceivedPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
    const { session_id } = await searchParams;
    return (
        <>
            <MobileNavbar appearance="solid" />
            <WebNavbar appearance="primary" showGetStarted={false} />
            <main className="flex min-h-svh items-start justify-center px-5 pt-24 pb-[calc(10rem+env(safe-area-inset-bottom))] sm:px-6 xl:pb-8">
                <CheckoutOrder sessionId={session_id} />
            </main>
        </>
    );
}
