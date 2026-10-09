import Checkout from "@/features/checkout/components/ui/checkout";
import { MobileNavbar, WebNavbar } from "@/components/platform";

/** Presents the customer checkout flow. */
export default function CheckoutPage() {
    return (
        <>
            <MobileNavbar appearance="solid" />
            <WebNavbar appearance="primary" showGetStarted={false} />
            <main className="flex min-h-svh items-start justify-center px-5 pt-18 pb-[calc(10rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-48 xl:h-svh xl:min-h-0 xl:items-center xl:px-40 xl:pt-12 xl:pb-8">
                <Checkout />
            </main>
        </>
    )
}
