'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/core/ui/toast';
import { initialOrderValues } from '@/features/orders/data/order.create';
import { createOrderInternally } from '@/features/orders/server/create.order.internally.action';
import { useOrderForm } from '@/features/orders/components/hooks/use.order.form';
import { useRef } from 'react';
import type { OrderFormValues } from '@/features/orders/utils/order.types';

/** Manages internal order entry, validation, and saving independently of its container. */
export function useCreateOrderForm(onCreated?: (number: string) => void) {
    const state = useOrderForm(initialOrderValues);
    const { t, form, validateAllocation } = state;
    const queryClient = useQueryClient();
    const orderReference = useRef<string | null>(null);
    const mutation = useMutation({
        mutationKey: ['orders', 'create'],
        mutationFn: (values: OrderFormValues) => {
            orderReference.current ??= crypto
                .randomUUID()
                .replaceAll('-', '')
                .slice(0, 12)
                .toUpperCase()
                .match(/.{3}/g)!
                .join('-');
            return createOrderInternally(values, orderReference.current);
        },
        retry: false,
        /** Refreshes orders and reports the saved order reference. */
        async onSuccess(number) {
            toast.add({ title: t('success', { number }), type: 'success' });
            form.reset(initialOrderValues);
            orderReference.current = null;
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            onCreated?.(number);
        },
        onError: () => {
            toast.add({ title: t('error'), type: 'error' });
        },
    });
    /** Submits validated purchase, customer, and delivery details. */
    const submit = form.handleSubmit((current) => {
        if (mutation.isPending || !validateAllocation()) return;
        mutation.mutate(current);
    });
    return { ...state, mutation, submit };
}
