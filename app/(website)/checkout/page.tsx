import Checkout from "@/features/checkout/components/ui/checkout";
import { MobileNavbar, WebNavbar } from "@/components/platform";
import { getCustomerUser } from "@/features/auth/server/auth.session";
import { checkoutPlanParams } from "@/features/checkout/data/checkout.plan.params";
import type { CheckoutPlan } from "@/features/checkout/utils/checkout.types";
import { checkoutVariants } from "@/features/checkout/data/checkout.variants";

/** Presents the customer checkout flow. */
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string | string[]; variant?: string | string[] }> }) {
    const { plan, variant } = await searchParams;
    const initialVariant = checkoutVariants.find(option => option.id.toLowerCase() === (typeof variant === "string" ? variant.toLowerCase() : undefined))?.id ?? "Everyday";
    const initialPlan = (Object.keys(checkoutPlanParams) as CheckoutPlan["id"][])
        .find(id => checkoutPlanParams[id] === plan) ?? "family";
    const customer = await getCustomerUser();
    return (
        <>
            <MobileNavbar appearance="solid" elevated={false} />
            <WebNavbar appearance="primary" showGetStarted={false} />
            <main className="flex items-start justify-center px-5 pt-24 pb-[calc(10rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-48 xl:px-40 xl:pt-32 xl:pb-8">
                <Checkout key={`${initialPlan}-${initialVariant}`} initialPlan={initialPlan} initialVariant={initialVariant} customer={customer ? { email: customer.email, name: customer.name, phone: customer.phone } : null} />
            </main>
        </>
    )
}
