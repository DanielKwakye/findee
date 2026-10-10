import { requireAdmin } from "@/features/auth/server/auth.session";
import CreateOrderForm from "@/features/orders/components/ui/create-order-form";

/** Hosts the reusable internal order form for authorized staff. */
export default async function CreateOrderPage() {
    await requireAdmin();
    return <CreateOrderForm />;
}
