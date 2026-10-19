import { requireAdmin } from "@/features/auth/server/auth.session";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import CreateOrderForm from "@/features/orders/components/ui/create-order-form";

export const metadata: Metadata = { title: messages.PageMetadata.titles.createOrder };

/** Hosts the reusable internal order form for authorized staff. */
export default async function CreateOrderPage() {
    await requireAdmin();
    return <CreateOrderForm />;
}
