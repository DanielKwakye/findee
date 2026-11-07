'use client';

import { useId, useImperativeHandle, useState, type Ref } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { createTicket } from '@/features/tickets/server/create.ticket.action';
import { toast } from '@/components/core/ui/toast';
import type { FeatureRequestDialogHandle } from '@/features/tickets/utils/ticket.types';

/** Manages customer feature requests through the existing support ticket flow. */
export function useFeatureRequestDialog(
    ref: Ref<FeatureRequestDialogHandle>,
    user: { name: string | null; email: string },
) {
    const t = useTranslations('FeatureRequest');
    const [open, setOpen] = useState(false);
    const inputId = useId();
    const form = useForm<{ message: string }>({ defaultValues: { message: '' } });
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (values: { message: string }) =>
            createTicket({
                name: user.name || user.email.slice(0, 100),
                email: user.email,
                message: t('ticketMessage', { message: values.message.trim() }),
            }),
        retry: false,
        /** Refreshes ticket lists and confirms the saved feature request. */
        onSuccess(ticket) {
            void queryClient.invalidateQueries({ queryKey: ['customer-tickets'] });
            void queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
            toast.add({ title: t('success', { code: ticket.code }), type: 'info' });
            setOpen(false);
            form.reset();
        },
    });
    useImperativeHandle(ref, () => ({
        /** Opens a fresh feature request. */
        open() {
            if (mutation.isPending) return;
            form.reset();
            mutation.reset();
            setOpen(true);
        },
    }));

    /** Dismisses the dialog while no request is being submitted. */
    function changeOpen(next: boolean) {
        if (!mutation.isPending) setOpen(next);
    }

    const input = form.register('message', {
        validate: (value) => !!value.trim() || t('required'),
        maxLength: { value: 4900, message: t('tooLong') },
    });
    /** Saves a validated request without submitting duplicates. */
    const submit = form.handleSubmit((values) => {
        if (!mutation.isPending) mutation.mutate(values);
    });
    return {
        t,
        open,
        inputId,
        input,
        error: form.formState.errors.message,
        mutation,
        changeOpen,
        submit,
    };
}
