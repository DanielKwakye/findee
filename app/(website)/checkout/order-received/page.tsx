import { MobileNavbar, WebNavbar } from "@/components/platform";
import OrderReceived from "@/features/checkout/components/ui/order-received";

/** Presents the acknowledgement for a submitted checkout. */
export default function OrderReceivedPage() {
    return (
        <>
            <MobileNavbar appearance="solid" />
            <WebNavbar appearance="primary" showGetStarted={false} />
            <main className="flex min-h-svh items-center justify-center px-5 pt-24 pb-[calc(10rem+env(safe-area-inset-bottom))] sm:px-6 xl:pb-8">
                <OrderReceived />
            </main>
        </>
    );
}
