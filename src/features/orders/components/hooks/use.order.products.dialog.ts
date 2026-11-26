'use client';

import { useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'debounce';
import { useTranslations } from 'next-intl';
import { useController, useForm, useWatch } from 'react-hook-form';
import { toast } from '@/components/core/ui/toast';
import type { PortalConfirmDialogHandle } from '@/components/platform';
import { addOrderProduct } from '@/features/orders/server/add.order.product.action';
import { getOrderProducts } from '@/features/orders/server/get.order.products.action';
import { removeOrderProduct } from '@/features/orders/server/remove.order.product.action';
import { updateOrderAutoAssign } from '@/features/orders/server/update.order.auto.assign.action';
import { updateOrderQuantity } from '@/features/orders/server/update.order.quantity.action';
import type {
    OrderProductsDialogHandle,
    OrderProductsDialogRecord,
} from '@/features/orders/utils/order.types';
import { getProducts } from '@/features/products/server/get.products.action';

/** Manages the product assignment dialog, inventory search, and assignment confirmations. */
export function useOrderProductsDialog(ref: Ref<OrderProductsDialogHandle>) {
    const t = useTranslations('orders');
    const queryClient = useQueryClient();
    const quantityInputId = useId();
    const confirmRef = useRef<PortalConfirmDialogHandle>(null);
    const [order, setOrder] = useState<OrderProductsDialogRecord | null>(null);
    const { control, register, reset } = useForm({ defaultValues: { search: '' } });
    const {
        control: quantityControl,
        handleSubmit: handleQuantitySubmit,
        reset: resetQuantity,
    } = useForm<{ quantity: string | null }>({ defaultValues: { quantity: null } });
    const { field: quantityInput, fieldState: quantityField } = useController({
        control: quantityControl,
        name: 'quantity',
        rules: {
            /** Validates the recorded sticker count. */
            validate(value) {
                const quantity = Number(value);
                return (
                    (Number.isInteger(quantity) && quantity >= 1 && quantity <= 2_147_483_647) ||
                    t('products.quantityInvalid')
                );
            },
        },
    });
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
    const autoAssignMutation = useMutation({
        /** Persists the selected assignment preference. */
        mutationFn: ({ orderId, checked }: { orderId: string; checked: boolean }) =>
            updateOrderAutoAssign(orderId, checked),
        /** Keeps the dialog cache in sync with the saved preference. */
        async onSuccess({ autoAssign }, { orderId }) {
            const queryKey = ['orders', 'products', orderId];
            await queryClient.cancelQueries({ queryKey });
            queryClient.setQueryData<typeof assigned.data>(
                queryKey,
                (current) => current && { ...current, autoAssign },
            );
        },
        /** Reports a failed preference update. */
        onError() {
            toast.add({ title: t('products.autoAssignError'), type: 'error' });
        },
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
    const quantityMutation = useMutation({
        /** Updates the order's recorded sticker quantity. */
        mutationFn: ({ orderId, quantity }: { orderId: string; quantity: number }) =>
            updateOrderQuantity(orderId, quantity),
        /** Refreshes order views and clears the saved draft. */
        async onSuccess(_, { orderId, quantity }) {
            const queryKey = ['orders', 'products', orderId];
            await queryClient.cancelQueries({ queryKey });
            queryClient.setQueryData<typeof assigned.data>(
                queryKey,
                (current) => current && { ...current, planDetail: { quantity } },
            );
            resetQuantity();
            toast.add({ title: t('products.quantitySaved'), type: 'success' });
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        /** Reports a failed quantity save. */
        onError() {
            toast.add({ title: t('products.quantitySaveError'), type: 'error' });
        },
    });
    const isUpdating =
        mutation.isPending || autoAssignMutation.isPending || quantityMutation.isPending;
    useImperativeHandle(ref, () => ({
        /** Opens the selected order with a fresh search. */
        open(record) {
            if (isUpdating) return;
            debounceSearch.clear();
            reset();
            resetQuantity();
            setDebouncedSearch('');
            setOrder(record);
        },
    }));

    /** Saves the entered quantity for the open order. */
    const saveQuantity = handleQuantitySubmit(({ quantity }) => {
        if (!order || isUpdating || quantity === null) return;
        quantityMutation.mutate({ orderId: order.id, quantity: Number(quantity) });
    });

    /** Dismisses the dialog when there is no update in progress. */
    function changeOpen(open: boolean) {
        if (!open && !isUpdating) setOrder(null);
    }

    /** Saves the checkbox value as soon as it changes. */
    function changeAutoAssign(checked: boolean) {
        if (!order || isUpdating) return;
        autoAssignMutation.mutate({ orderId: order.id, checked });
    }

    /** Confirms the selected assignment change before sending it to the server. */
    function requestChange(action: 'add' | 'remove', code: string) {
        if (!order || isUpdating) return;
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
        quantityInput: {
            ...quantityInput,
            id: quantityInputId,
            value: quantityInput.value ?? assigned.data?.planDetail.quantity ?? '',
        },
        saveQuantity,
        quantityError: quantityField.error?.message,
        isUpdating,
        autoAssign: autoAssignMutation.isPending
            ? autoAssignMutation.variables.checked
            : assigned.data && (assigned.data.autoAssign ?? true),
        changeAutoAssign,
        confirmRef,
        changeOpen,
        requestChange,
    };
}
