'use client';

import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'debounce';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import type { PortalConfirmDialogHandle } from '@/components/platform';
import { addOrderProduct } from '@/features/orders/server/add.order.product.action';
import { getOrderProducts } from '@/features/orders/server/get.order.products.action';
import { removeOrderProduct } from '@/features/orders/server/remove.order.product.action';
import type {
    OrderProductsDialogHandle,
    OrderProductsDialogRecord,
} from '@/features/orders/utils/order.types';
import { getProducts } from '@/features/products/server/get.products.action';

/** Manages the product assignment dialog, inventory search, and assignment confirmations. */
export function useOrderProductsDialog(ref: Ref<OrderProductsDialogHandle>) {
    const t = useTranslations('orders');
    const queryClient = useQueryClient();
    const confirmRef = useRef<PortalConfirmDialogHandle>(null);
    const [order, setOrder] = useState<OrderProductsDialogRecord | null>(null);
    const { control, register, reset } = useForm({ defaultValues: { search: '' } });
    const search = useWatch({ control, name: 'search' }).trim();
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const debounceSearch = useMemo(() => debounce(setDebouncedSearch, 350), []);
    useEffect(() => {
        debounceSearch(search);
        return () => debounceSearch.clear();
    }, [debounceSearch, search]);

    const assigned = useQuery({
        queryKey: ['orders', 'products', order?.id],
        queryFn: () => getOrderProducts(order!.id),
        enabled: !!order,
    });
    const matches = useQuery({
        queryKey: ['products', 'reassignment', debouncedSearch],
        queryFn: () =>
            getProducts({
                page: 1,
                pageSize: 5,
                search: debouncedSearch,
                sortBy: 'code',
                direction: 'asc',
                variant: 'all',
            }),
        enabled: !!order && !!search && !!debouncedSearch,
        placeholderData: keepPreviousData,
    });
    const mutation = useMutation({
        /** Updates the association between an order and a sticker. */
        mutationFn(
            values: { orderId: string; code: string } & (
                { action: 'add'; updatedAt: Date } | { action: 'remove' }
            ),
        ) {
            return values.action === 'add'
                ? addOrderProduct(values.orderId, values.code, values.updatedAt)
                : removeOrderProduct(values.orderId, values.code);
        },
        retry: false,
        /** Refreshes active order and inventory views after an assignment changes. */
        async onSuccess() {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['orders'] }),
                queryClient.invalidateQueries({ queryKey: ['products'] }),
            ]);
        },
    });
    useImperativeHandle(ref, () => ({
        /** Opens the selected order with a fresh search. */
        open(record) {
            if (mutation.isPending) return;
            debounceSearch.clear();
            reset();
            setDebouncedSearch('');
            setOrder(record);
        },
    }));

    /** Dismisses the dialog when there is no update in progress. */
    function changeOpen(open: boolean) {
        if (!open && !mutation.isPending) setOrder(null);
    }

    /** Confirms the selected assignment change before sending it to the server. */
    function requestChange(action: 'add' | 'remove', code: string) {
        if (!order || mutation.isPending) return;
        const orderId = order.id;
        const product = matches.data?.products.find((result) => result.code === code);
        if (action === 'add' && (!product || product.orderId === orderId)) return;
        const moving = action === 'add' && product && !product.isAvailable;
        confirmRef.current?.open({
            title: t(moving ? 'products.moveTitle' : `products.${action}Title`),
            description: t(moving ? 'products.moveDescription' : `products.${action}Description`, {
                code,
                number: order.number,
            }),
            confirmLabel: t(moving ? 'products.move' : `products.${action}`),
            errorMessage: t(`products.${action}Error`),
            destructive: action === 'remove' || !!moving,
            onConfirm: () =>
                mutation.mutateAsync(
                    action === 'add' && product
                        ? { orderId, code, action, updatedAt: product.updatedAt }
                        : { orderId, code, action: 'remove' },
                ),
        });
    }

    return {
        t,
        order,
        assigned,
        matches,
        results: matches.data?.products.map(
            ({ code, variant, assignedTo, assignedToId, orderId, isAvailable }) => ({
                code,
                variant,
                isAvailable,
                isOnOrder: orderId === order?.id,
                assignee: assignedTo?.name || assignedTo?.email,
                assignedElsewhere: !!assignedToId && assignedToId !== order?.customerId,
            }),
        ),
        search,
        searchInput: register('search'),
        isUpdating: mutation.isPending,
        confirmRef,
        changeOpen,
        requestChange,
    };
}
