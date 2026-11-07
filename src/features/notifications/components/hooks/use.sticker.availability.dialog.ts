'use client';

import { useId, useImperativeHandle, type Ref } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/core/ui/toast';
import { subscribeStickerAvailability } from '@/features/notifications/server/subscribe.sticker.availability.action';
import {
    checkoutVariants,
    checkoutComingSoonVariants,
    type CheckoutVariant,
} from '@/features/checkout/data/checkout.variants';
import type {
    StickerAvailabilityDialogHandle,
    StickerAvailabilityValues,
} from '@/features/notifications/utils/sticker.availability.types';

/** Manages variant selection and email entry for sticker availability notifications. */
export function useStickerAvailabilityDialog(ref: Ref<StickerAvailabilityDialogHandle>) {
    const t = useTranslations();
    const emailId = useId();
    const form = useForm<StickerAvailabilityValues>({
        defaultValues: { variant: null, variants: [], email: '', name: '' },
    });
    const variantId = useWatch({ control: form.control, name: 'variant' });
    const variant = checkoutVariants.find((option) => option.id === variantId);
    const selectedVariants = useWatch({ control: form.control, name: 'variants' });
    const selectedVariant =
        checkoutVariants.find((option) => option.id === selectedVariants[0]) ?? variant;
    const title =
        selectedVariants.length > 1
            ? t('StickerAvailability.title.both')
            : selectedVariant
              ? t(`StickerAvailability.title.${selectedVariant.key}`)
              : '';
    const notificationVariants = checkoutVariants.filter(
        (option) => checkoutComingSoonVariants[option.id],
    );
    const mutation = useMutation({
        mutationFn: subscribeStickerAvailability,
        retry: false,
        /** Confirms the subscription request and clears the completed form. */
        onSuccess() {
            toast.add({
                title: t('StickerAvailability.success'),
                type: 'info',
            });
            form.reset({ variant: null, variants: [], email: '', name: '' });
        },
    });

    useImperativeHandle(ref, () => ({
        /** Opens email entry for the selected sticker variant. */
        open(selectedVariant) {
            if (mutation.isPending) return;
            mutation.reset();
            form.reset({
                variant: selectedVariant,
                variants: [selectedVariant],
                email: '',
                name: '',
            });
        },
    }));

    /** Clears the notification form when the dialog is dismissed. */
    function changeOpen(open: boolean) {
        if (!open && !mutation.isPending)
            form.reset({ variant: null, variants: [], email: '', name: '' });
    }

    /** Updates the sticker variants requested for availability notifications. */
    function onVariantChange(selectedVariant: CheckoutVariant, checked: boolean) {
        const selected = form.getValues('variants');
        form.setValue(
            'variants',
            checked
                ? [...selected, selectedVariant]
                : selected.filter((value) => value !== selectedVariant),
            { shouldDirty: true, shouldValidate: true },
        );
    }

    const variantRules = {
        /** Requires a sticker preference for availability notifications. */
        validate: (selected: CheckoutVariant[]) =>
            selected.length > 0 || t('StickerAvailability.variantsRequired'),
    };

    /** Handles validated sticker availability notification requests. */
    function onNotify(values: StickerAvailabilityValues) {
        if (!mutation.isPending)
            mutation.mutate({ email: values.email, variants: values.variants, name: values.name });
    }

    const nameInput = form.register('name', {
        maxLength: { value: 100, message: t('StickerAvailability.nameInvalid') },
    });

    const emailInput = form.register('email', {
        required: t('Checkout.details.emailRequired'),
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t('Checkout.details.emailInvalid'),
        },
    });

    return {
        t,
        variant,
        title,
        notificationVariants,
        control: form.control,
        variantRules,
        onVariantChange,
        emailId,
        emailInput,
        nameInput,
        errors: form.formState.errors,
        mutation,
        changeOpen,
        submit: form.handleSubmit(onNotify),
    };
}
