import { createElement } from "react";
import type { useTranslations } from "next-intl";
import type { PortalTableColumnDef } from "@/components/platform";
import OrderStatusBadge from "@/features/orders/components/ui/order-status-badge";
import type { CustomerOrderRow } from "@/features/orders/utils/order.types";

/** Defines customer purchase columns and their tracking action. */
export function getCustomerOrderColumns(t: ReturnType<typeof useTranslations>, formatDate: (date: Date) => string,
    formatPrice: (price: number, currency: string) => string): PortalTableColumnDef<CustomerOrderRow>[] {
    return [
        { accessorKey: "number", header: t("columns.number") },
        { accessorKey: "createdAt", header: t("customer.date"), cell: ({ row }) => formatDate(row.original.createdAt) },
        { id: "quantity", header: t("details.quantity"), enableSorting: false, cell: ({ row }) => row.original.planDetail.quantity },
        { id: "price", header: t("details.price"), enableSorting: false, cell: ({ row }) => formatPrice(row.original.planDetail.price, row.original.planDetail.currency) },
        { accessorKey: "status", header: t("columns.status"), cell: ({ row }) => createElement(OrderStatusBadge, { status: row.original.status, label: t(`statuses.${row.original.status}`) }) },
    ];
}
