'use client';

import { createElement, useCallback, useMemo, useRef, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormatter, useTranslations } from 'next-intl';
import type { SortingState } from '@tanstack/react-table';
import type { PortalTableColumnDef, PortalTablePaginationState } from '@/components/platform';
import { formatAmount, usePortalTableSearch, useUserDateTime } from '@/components/platform';
import { getOrders } from '@/features/orders/server/get.orders.action';
import { getOrderColumns } from '@/features/orders/utils/order.columns';
import type { OrderColumnLabels } from '@/features/orders/utils/order.columns';
import type {
    OrderDetailsDialogHandle,
    OrderRow,
    OrderStatusFilter,
    OrderStatusDialogHandle,
    OrderStatusDialogRecord,
    OrderPaymentDateDialogHandle,
    OrderPaymentDateRecord,
    OrderShipmentsDialogHandle,
    AddOrderShipmentDialogHandle,
} from '@/features/orders/utils/order.types';
import OrderActions from '@/features/orders/components/ui/order-actions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { EditOrderDialogHandle } from '@/features/orders/utils/order.types';
import { resendOrderInvoice } from '@/features/orders/server/resend.order.invoice.action';
import { toast } from '@/components/core/ui/toast';

/** Manages order queries and server-side table controls for a status view. */
export function useOrdersTable(status: OrderStatusFilter, pendingPayments = false) {
    const t = useTranslations('orders');
    const format = useFormatter();
    const formatDate = useUserDateTime();
    const queryClient = useQueryClient();
    const { mutate: resendInvoice, isPending: invoicePending } = useMutation({
        mutationFn: resendOrderInvoice,
        retry: false,
        /** Refreshes payment records after invoice delivery or payment reconciliation. */
        async onSuccess() {
            toast.add({ title: t('resendInvoiceSuccess'), type: 'success' });
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: () => toast.add({ title: t('resendInvoiceError'), type: 'error' }),
    });
    const detailsRef = useRef<OrderDetailsDialogHandle>(null);
    const editRef = useRef<EditOrderDialogHandle>(null);
    /** Opens the internally managed editor for a selected order. */
    const openEdit = useCallback((id: string) => {
        editRef.current?.open(id);
    }, []);
    const statusRef = useRef<OrderStatusDialogHandle>(null);
    const paymentDateRef = useRef<OrderPaymentDateDialogHandle>(null);
    const shipmentsRef = useRef<OrderShipmentsDialogHandle>(null);
    const addShipmentRef = useRef<AddOrderShipmentDialogHandle>(null);
    /** Opens the internally managed order details dialog. */
    const openDetails = useCallback((id: string) => {
        detailsRef.current?.open(id);
    }, []);
    /** Opens order details when a table record is selected. */
    const openOrder = useCallback((order: OrderRow) => {
        detailsRef.current?.open(order.id);
    }, []);
    /** Opens the internally managed status editor for an order. */
    const openStatus = useCallback((order: OrderStatusDialogRecord) => {
        statusRef.current?.open(order);
    }, []);
    /** Opens the internally managed payment date editor for an order. */
    const openPaymentDate = useCallback((order: OrderPaymentDateRecord) => {
        paymentDateRef.current?.open(order);
    }, []);
    /** Opens the internally managed shipment list for an order. */
    const openShipments = useCallback((order: OrderStatusDialogRecord) => {
        shipmentsRef.current?.open(order);
    }, []);
    /** Opens the internally managed shipment creation form for an order. */
    const openAddShipment = useCallback((order: OrderStatusDialogRecord) => {
        addShipmentRef.current?.open(order);
    }, []);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pagination, setPagination] = useState<PortalTablePaginationState>({
        page: 1,
        pageSize: 10,
    });
    const { search, setSearch, debouncedSearch } = usePortalTableSearch(setPagination);
    const [sorting, setSorting] = useState<SortingState>([]);
    const query = useQuery({
        queryKey: ['orders', status, pendingPayments, pagination, debouncedSearch, sorting],
        queryFn: () =>
            getOrders(
                {
                    ...pagination,
                    status,
                    search: debouncedSearch,
                    sortBy: sorting[0]?.id ?? 'createdAt',
                    direction: !sorting[0] || sorting[0].desc ? 'desc' : 'asc',
                },
                pendingPayments,
            ),
        placeholderData: keepPreviousData,
    });
    const columns = useMemo<PortalTableColumnDef<OrderRow>[]>(() => {
        const labels: OrderColumnLabels = {
            number: t('columns.number'),
            customer: t('columns.customer'),
            status: t('columns.status'),
            actions: t('columns.actions'),
            viewDetails: t('details.view'),
            estimatedDeliveryDate: t('columns.estimatedDeliveryDate'),
            expectedPostingDate: t('columns.expectedPostingDate'),
        };
        const baseColumns = getOrderColumns(
            labels,
            {
                AWAITING_PAYMENT: t('statuses.AWAITING_PAYMENT'),
                PENDING: t('statuses.PENDING'),
                CONFIRMED: t('statuses.CONFIRMED'),
                PROCESSING: t('statuses.PROCESSING'),
                HOLD: t('statuses.HOLD'),
                SHIPPED: t('statuses.SHIPPED'),
                DELIVERED: t('statuses.DELIVERED'),
                CANCELLED: t('statuses.CANCELLED'),
                RETURNED: t('statuses.RETURNED'),
            },
            formatDate,
        );
        const paymentColumns: PortalTableColumnDef<OrderRow>[] = [
            {
                id: 'amount',
                header: t('details.price'),
                enableSorting: false,
                cell: ({ row }) => formatAmount(row.original.price, row.original.currency, format),
            },
            {
                accessorKey: 'createdAt',
                header: t('columns.createdAt'),
                cell: ({ row }) => formatDate(row.original.createdAt),
            },
        ];
        return [
            ...(pendingPayments
                ? [
                      ...baseColumns.filter(
                          (column) =>
                              !['expectedPostingDate', 'estimatedDeliveryDate'].includes(
                                  'accessorKey' in column
                                      ? String(column.accessorKey)
                                      : (column.id ?? ''),
                              ),
                      ),
                      ...paymentColumns,
                  ]
                : baseColumns),
            {
                id: 'actions',
                header: labels.actions,
                enableSorting: false,
                enableHiding: false,
                cell: ({ row }) =>
                    createElement(OrderActions, {
                        order: row.original,
                        label: labels.viewDetails,
                        onOpen: openDetails,
                        onEdit: openEdit,
                        onChangeStatus: openStatus,
                        onUpdatePaymentDate: openPaymentDate,
                        onViewShipments: openShipments,
                        onAddShipment: openAddShipment,
                        onResendInvoice: resendInvoice,
                        invoicePending,
                    }),
            },
        ];
    }, [
        t,
        formatDate,
        format,
        pendingPayments,
        openDetails,
        openEdit,
        openStatus,
        openPaymentDate,
        openShipments,
        openAddShipment,
        resendInvoice,
        invoicePending,
    ]);
    /** Opens the selected order status while preserving unrelated URL parameters. */
    function changeStatus(next: OrderStatusFilter) {
        const params = new URLSearchParams(searchParams.toString());
        if (next === 'all') params.delete('status');
        else params.set('status', next);
        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }

    return {
        t,
        query,
        columns,
        search,
        setSearch,
        setSorting,
        setPagination,
        changeStatus,
        detailsRef,
        editRef,
        statusRef,
        paymentDateRef,
        shipmentsRef,
        addShipmentRef,
        openOrder,
        pagination: {
            ...pagination,
            page: query.isPlaceholderData ? pagination.page : (query.data?.page ?? pagination.page),
            total: query.data?.total ?? 0,
        },
    };
}
