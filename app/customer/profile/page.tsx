import { CustomerProfileForm } from "@/features/auth/components/ui/customer-profile-form";
import { requireCustomer } from "@/features/auth/server/auth.session";

/** Reserves the customer's account profile page for future content. */
export default async function CustomerProfilePage() {
    const user = await requireCustomer();
    return <CustomerProfileForm initialValues={{ name: user.name ?? "", phone: user.phone ?? "" }} />;
}
