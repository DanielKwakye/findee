'use client';

import { useImperativeHandle, useState, type Ref } from 'react';
import type {
    CheckoutPlan,
    CheckoutPreviewHandle,
    CheckoutValues,
} from '@/features/checkout/utils/checkout.types';

/** Manages the checkout preview and the reviewed details used to start payment. */
export function useCheckoutPreview(
    ref: Ref<CheckoutPreviewHandle>,
    isSubmitting: boolean,
    onConfirm: (values: CheckoutValues) => void,
) {
    const [preview, setPreview] = useState<{ values: CheckoutValues; plan: CheckoutPlan } | null>(
        null,
    );
    useImperativeHandle(ref, () => ({
        /** Opens a review of the customer's current checkout details. */
        open(values, plan) {
            if (!isSubmitting) setPreview({ values: structuredClone(values), plan });
        },
    }));

    /** Allows customers to return to editing when payment is idle. */
    function changeOpen(open: boolean) {
        if (!open && !isSubmitting) setPreview(null);
    }

    /** Confirms the exact checkout details displayed in the preview. */
    function confirm() {
        if (preview && !isSubmitting) onConfirm(preview.values);
    }

    return { preview, changeOpen, confirm };
}
