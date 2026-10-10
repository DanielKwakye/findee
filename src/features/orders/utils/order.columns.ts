import type { PortalTableColumnDef } from "@/components/platform";
import type { OrderRow } from "@/features/orders/utils/order.types";
import type { OrderStatus } from "@/generated/client";
import { createElement } from "react";
import OrderStatusBadge from "@/features/orders/components/ui/order-status-badge";

export type OrderColumnLabels = Record<"number" | "customer" | "status" | "actions" | "viewDetails", string>;

/** Defines order columns with localized account, plan, and fulfillment details. */
export function getOrderColumns(labels: OrderColumnLabels, statuses: Record<OrderStatus, string>): PortalTableColumnDef<OrderRow>[] {
    return [
        { accessorKey: "number", header: labels.number },
        { id: "customer", header: labels.customer, enableSorting: false, cell: ({ row }) => [row.original.customer.name, row.original.customer.email].filter(Boolean).join(" · ") },
        { accessorKey: "status", header: labels.status, cell: ({ row }) => createElement(OrderStatusBadge, { status: row.original.status, label: statuses[row.original.status] }) },
    ];
}
