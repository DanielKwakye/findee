"use client";

import { createElement, useCallback, useMemo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import type { SortingState } from "@tanstack/react-table";
import { usePortalTableSearch, useUserDateTime } from "@/components/platform";
import type { PortalTableColumnDef, PortalTablePaginationState } from "@/components/platform";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import { getCustomerOrders } from "@/features/orders/server/get.customer.orders.action";
import { getCustomerOrderColumns } from "@/features/orders/utils/customer.order.columns";
import type { CustomerOrderRow, OrderShipmentsDialogHandle } from "@/features/orders/utils/order.types";

/** Manages the customer's orders, table controls, and tracking selection. */
export function useCustomerOrders() {
    const t = useTranslations("orders");
    const formatter = useFormatter();
    const formatDate = useUserDateTime();
    const trackingRef = useRef<OrderShipmentsDialogHandle>(null);
    const [pagination, setPagination] = useState<PortalTablePaginationState>({ page: 1, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const { search, setSearch, debouncedSearch } = usePortalTableSearch(setPagination);
    const query = useQuery({
        queryKey: ["customer-orders", pagination, debouncedSearch, sorting],
        queryFn: () => getCustomerOrders({ ...pagination, status: "all", search: debouncedSearch,
            sortBy: sorting[0]?.id ?? "createdAt", direction: !sorting[0] || sorting[0].desc ? "desc" : "asc" }),
        placeholderData: keepPreviousData,
    });
    /** Opens tracking for a selected customer order. */
    const trackOrder = useCallback((order: CustomerOrderRow) => { trackingRef.current?.open(order); }, []);
    const columns = useMemo<PortalTableColumnDef<CustomerOrderRow>[]>(() => [
        ...getCustomerOrderColumns(t, formatDate, (price, currency) => formatter.number(price, { style: "currency", currency })),
        { id: "actions", header: t("customer.action"), enableSorting: false, enableHiding: false,
            cell: ({ row }) => createElement(Button, { type: "button", variant: "outline", size: "sm", className: "[&>span]:text-sm", onClick: () => trackOrder(row.original) },
                createElement(TypographyBody, null, t("customer.track"))) },
    ], [t, formatDate, formatter, trackOrder]);

    return { t, query, columns, search, setSearch, setSorting, setPagination, trackingRef,
        pagination: { ...pagination, page: query.isPlaceholderData ? pagination.page : query.data?.page ?? pagination.page, total: query.data?.total ?? 0 } };
}
