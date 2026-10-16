import { createElement } from "react";
import type { useTranslations } from "next-intl";
import { Badge } from "@/components/core/ui/badge";
import type { PortalTableColumnDef } from "@/components/platform";
import type { TicketRow } from "@/features/tickets/utils/ticket.types";
import { ticketStatusBadgeClasses } from "@/features/tickets/data/ticket.statuses";

/** Defines the customer's ticket history columns with localized dates and statuses. */
export function getTicketColumns(t: ReturnType<typeof useTranslations>, formatDate: (date: Date) => string, audience: "customer" | "admin" = "customer"): PortalTableColumnDef<TicketRow>[] {
    return [
        { accessorKey: "code", header: t("columns.code") },
        { accessorKey: "createdAt", header: t("columns.createdAt"), cell: ({ row }) => formatDate(row.original.createdAt) },
        ...(audience === "admin" ? [
            { accessorKey: "customerName", header: t("columns.customerName"), enableSorting: false },
            { accessorKey: "customerEmail", header: t("columns.customerEmail"), enableSorting: false },
        ] : []),
        { accessorKey: "message", header: t("columns.message"), enableSorting: false,
            cell: ({ row }) => row.original.message.length > 100 ? t("messagePreview", { message: row.original.message.slice(0, 100) }) : row.original.message },
        { accessorKey: "status", header: t("columns.status"),
            cell: ({ row }) => createElement(Badge, { variant: "secondary", className: ticketStatusBadgeClasses[row.original.status] }, t(`statuses.${row.original.status}`)) },
    ];
}
