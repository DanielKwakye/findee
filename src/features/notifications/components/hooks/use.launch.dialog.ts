'use client';

import { useId, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/core/ui/toast';
import { checkoutVariants } from '@/features/checkout/data/checkout.variants';
import { subscribeStickerAvailability } from '@/features/notifications/server/subscribe.sticker.availability.action';
import type {
    LaunchDialogHandle,
    StickerAvailabilityValues,
} from '@/features/notifications/utils/sticker.availability.types';

/** Manages opening the launch dialog from a subscription button. */
export function useLaunchDialogButton() {
    const dialogRef = useRef<LaunchDialogHandle>(null);

    /** Opens the launch subscription form. */
    function openDialog() {
        dialogRef.current?.open();
    }

    return { dialogRef, openDialog };
}

/** Manages the launch dialog and subscriptions to sticker updates. */
export function useLaunchDialog(ref: Ref<LaunchDialogHandle>) {
    const t = useTranslations();
    const emailId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<Pick<StickerAvailabilityValues, 'email' | 'name'>>({
        defaultValues: { email: '', name: '' },
    });
    const mutation = useMutation({
        mutationFn: subscribeStickerAvailability,
        retry: false,
        /** Confirms a completed subscription and dismisses the dialog. */
        onSuccess() {
            toast.add({ title: t('StickerAvailability.success'), type: 'info', timeout: 10000 });
            form.reset();
            setIsOpen(false);
        },
    });

    useImperativeHandle(ref, () => ({
        /** Opens the launch subscription dialog. */
        open() {
            if (mutation.isPending) return;
            mutation.reset();
            form.reset();
            setIsOpen(true);
        },
    }));

    /** Dismisses the dialog when a subscription is not being submitted. */
    function changeOpen(open: boolean) {
        if (!open && !mutation.isPending) setIsOpen(false);
    }

    /** Subscribes the validated email address to all sticker variants. */
    function onSubscribe(values: Pick<StickerAvailabilityValues, 'email' | 'name'>) {
        if (!mutation.isPending)
            mutation.mutate({
                email: values.email,
                name: values.name,
                variants: checkoutVariants.map((variant) => variant.id),
            });
    }

    const emailInput = form.register('email', {
        required: t('Checkout.details.emailRequired'),
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t('Checkout.details.emailInvalid'),
        },
    });

    const nameInput = form.register('name', {
        maxLength: { value: 100, message: t('StickerAvailability.nameInvalid') },
    });

    return {
        t,
        emailId,
        isOpen,
        emailInput,
        nameInput,
        errors: form.formState.errors,
        mutation,
        changeOpen,
        submit: form.handleSubmit(onSubscribe),
    };
}
