import type { PortalTableColumnDef } from "@/components/platform";
import type { OrderRow } from "@/features/orders/utils/order.types";
import type { OrderStatus } from "@/generated/client";
import { createElement } from "react";
import OrderStatusBadge from "@/features/orders/components/ui/order-status-badge";
import { getShippingDateClass } from "@/features/orders/utils/order.details";

export type OrderColumnLabels = Record<"number" | "customer" | "status" | "actions" | "viewDetails" | "estimatedDeliveryDate" | "expectedPostingDate", string>;

/** Defines order columns with localized account, plan, and fulfillment details. */
export function getOrderColumns(labels: OrderColumnLabels, statuses: Record<OrderStatus, string>, formatDate: (date: Date, options?: { dateOnly?: boolean }) => string): PortalTableColumnDef<OrderRow>[] {
    return [
        { accessorKey: "number", header: labels.number },
        { id: "customer", header: labels.customer, enableSorting: false, cell: ({ row }) => [row.original.customer.name, row.original.customer.email].filter(Boolean).join(" · ") },
        { accessorKey: "status", header: labels.status, cell: ({ row }) => createElement(OrderStatusBadge, { status: row.original.status, label: statuses[row.original.status] }) },
        { accessorKey: "expectedPostingDate", header: labels.expectedPostingDate, enableSorting: false,
            cell: ({ row }) => createElement("span", {
                className: getShippingDateClass(row.original.expectedPostingDate),
            }, formatDate(new Date(`${row.original.expectedPostingDate}T00:00:00Z`), { dateOnly: true })) },
        { accessorKey: "estimatedDeliveryDate", header: labels.estimatedDeliveryDate, enableSorting: false,
            cell: ({ row }) => createElement("span", {
                className: getShippingDateClass(row.original.estimatedDeliveryDate, row.original.status),
            }, formatDate(new Date(`${row.original.estimatedDeliveryDate}T00:00:00Z`), { dateOnly: true })) },
    ];
}
