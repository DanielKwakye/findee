import CustomerOrdersTable from "@/features/orders/components/ui/customer-orders-table";
import type { Metadata } from "next";
import messages from "@/translations/en.json";

export const metadata: Metadata = { title: messages.PageMetadata.titles.customerOrders };

/** Reserves the customer's orders page for future content. */
export default function CustomerOrdersPage() {
    return <CustomerOrdersTable />;
}
