"use client";

import { createElement, useCallback, useMemo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { SortingState } from "@tanstack/react-table";
import { usePortalTableSearch, useUserDateTime } from "@/components/platform";
import type { PortalTableColumnDef, PortalTablePaginationState } from "@/components/platform";
import { getTickets } from "@/features/tickets/server/get.tickets.action";
import { getTicketColumns } from "@/features/tickets/utils/ticket.columns";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import type { TicketDialogHandle, TicketRow, TicketStatusFilter } from "@/features/tickets/utils/ticket.types";

/** Manages customer ticket history queries and server-side table controls. */
export function useTicketTable(audience: "customer" | "admin" = "customer") {
    const t = useTranslations("TicketHistory");
    const formatDate = useUserDateTime();
    const detailsRef = useRef<TicketDialogHandle>(null);
    /** Opens the selected ticket for administrator review. */
    const openTicket = useCallback((ticket: TicketRow) => { detailsRef.current?.open(ticket.id); }, []);
    const [pagination, setPagination] = useState<PortalTablePaginationState>({ page: 1, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [status, setStatus] = useState<TicketStatusFilter>("all");
    const { search, setSearch, debouncedSearch } = usePortalTableSearch(setPagination);
    const query = useQuery({
        queryKey: [audience === "admin" ? "admin-tickets" : "customer-tickets", pagination, debouncedSearch, sorting, status],
        queryFn: () => getTickets({ ...pagination, search: debouncedSearch, status,
            sortBy: sorting[0]?.id ?? "createdAt", direction: !sorting[0] || sorting[0].desc ? "desc" : "asc" }, audience),
        placeholderData: keepPreviousData,
    });
    const columns = useMemo<PortalTableColumnDef<TicketRow>[]>(() => [
        ...getTicketColumns(t, formatDate, audience),
        ...(audience === "admin" ? [{ id: "actions", header: t("columns.actions"), enableSorting: false, enableHiding: false,
            cell: ({ row }: { row: { original: TicketRow } }) => createElement(Button, { type: "button", variant: "outline", size: "sm", onClick: () => openTicket(row.original) },
                createElement(TypographyBody, null, t("view"))) }] : []),
    ], [t, formatDate, audience, openTicket]);

    /** Starts at the first page when the ticket status filter changes. */
    function changeStatus(next: TicketStatusFilter) {
        setStatus(next);
        setPagination(current => ({ ...current, page: 1 }));
    }

    return { t, query, columns, search, setSearch, setSorting, setPagination, detailsRef, openTicket, status, changeStatus,
        pagination: { ...pagination, page: query.isPlaceholderData ? pagination.page : query.data?.page ?? pagination.page, total: query.data?.total ?? 0 } };
}
