import Checkout from "@/features/checkout/components/ui/checkout";
import { MobileNavbar, WebNavbar } from "@/components/platform";
import { getCustomerUser } from "@/features/auth/server/auth.session";

/** Presents the customer checkout flow. */
export default async function CheckoutPage() {
    const customer = await getCustomerUser();
    return (
        <>
            <MobileNavbar appearance="solid" />
            <WebNavbar appearance="primary" showGetStarted={false} />
            <main className="flex items-start justify-center px-5 pt-18 pb-[calc(10rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-48 xl:px-40 xl:pt-32 xl:pb-8">
                <Checkout customer={customer ? { email: customer.email, name: customer.name, phone: customer.phone } : null} />
            </main>
        </>
    )
}
