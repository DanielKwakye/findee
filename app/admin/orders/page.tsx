import OrdersTable from "@/features/orders/components/ui/orders-table";
import { requireAdmin } from "@/features/auth/server/auth.session";
import { orderStatuses } from "@/features/orders/data/order.statuses";

/** Renders the administrator's selected order status view. */
export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string | string[] }> }) {
    await requireAdmin();
    const params = await searchParams;
    const status = orderStatuses.find(value => value === params.status) ?? "all";
    return <OrdersTable key={status} status={status} />;
}
