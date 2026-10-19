import { CustomerProfileForm } from "@/features/auth/components/ui/customer-profile-form";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import { requireCustomer } from "@/features/auth/server/auth.session";
import CloseCustomerAccount from "@/features/auth/components/ui/close-customer-account";

export const metadata: Metadata = { title: messages.PageMetadata.titles.profile };

/** Reserves the customer's account profile page for future content. */
export default async function CustomerProfilePage() {
    const user = await requireCustomer();
    return <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CustomerProfileForm initialValues={{ name: user.name ?? "", phone: user.phone ?? "" }} />
        <CloseCustomerAccount />
    </div>;
}
