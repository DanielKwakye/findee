'use client';

import { useImperativeHandle, useState } from 'react';
import type { Ref } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from '@/components/core/ui/toast';
import { updateOrderPaymentDate } from '@/features/orders/server/update.order.payment.date.action';
import type {
    OrderPaymentDateDialogHandle,
    OrderPaymentDateRecord,
    OrderPaymentDateValues,
} from '@/features/orders/utils/order.types';

/** Manages the order payment date form, saving, and dialog lifecycle. */
export function useOrderPaymentDateDialog(ref: Ref<OrderPaymentDateDialogHandle>) {
    const t = useTranslations('orders.paymentDateDialog');
    const queryClient = useQueryClient();
    const [order, setOrder] = useState<OrderPaymentDateRecord | null>(null);
    const form = useForm<OrderPaymentDateValues>({ defaultValues: { paymentDate: '' } });
    const mutation = useMutation({
        mutationFn: updateOrderPaymentDate,
        retry: false,
        /** Refreshes order views after recording a payment date. */
        async onSuccess() {
            toast.add({ title: t('saveSuccess'), type: 'success' });
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            setOrder(null);
        },
        onError: () => toast.add({ title: t('saveError'), type: 'error' }),
    });
    useImperativeHandle(ref, () => ({
        /** Opens the payment date form for the selected order. */
        open(record) {
            if (mutation.isPending) return;
            mutation.reset();
            const date = record.paymentAt ? new Date(record.paymentAt) : null;
            form.reset({
                paymentDate: date
                    ? new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
                          .toISOString()
                          .slice(0, 10)
                    : '',
            });
            setOrder(record);
        },
    }));
    const input = form.register('paymentDate', {
        required: t('required'),
        validate: (value) =>
            Number.isFinite(new Date(`${value}T00:00:00`).getTime()) || t('required'),
    });

    /** Dismisses the payment date editor while no save is in progress. */
    function changeOpen(open: boolean) {
        if (!open && !mutation.isPending) setOrder(null);
    }

    /** Records the selected payment date for the current order. */
    const submit = form.handleSubmit((values) => {
        if (!order || mutation.isPending) return;
        mutation.mutate({
            id: order.id,
            paymentAt: new Date(`${values.paymentDate}T00:00:00`).toISOString(),
        });
    });

    return { t, order, form, mutation, input, changeOpen, submit };
}
