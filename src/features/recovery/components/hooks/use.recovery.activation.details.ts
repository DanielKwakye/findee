'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { useCheckoutContactRules } from '@/features/checkout/components/hooks/use.checkout.contact.rules';
import { submitRecoveryActivation } from '@/features/recovery/server/submit.recovery.activation.action';
import type {
    CheckoutContactValues,
    CheckoutCustomer,
} from '@/features/checkout/utils/checkout.types';

/** Manages the verified customer identity and finder contact preferences for activation. */
export function useRecoveryActivationDetails(code: string, customer: CheckoutCustomer | null) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const rules = useCheckoutContactRules();
    const form = useForm<CheckoutContactValues>({
        defaultValues: {
            email: customer?.email ?? '',
            name: customer?.name ?? '',
            phone: customer?.phone ?? '',
            contactByEmail: true,
            showName: false,
            contactByPhone: false,
        },
    });
    const [contactByEmail, contactByPhone] = useWatch({
        control: form.control,
        name: ['contactByEmail', 'contactByPhone'],
    });
    const contactInputs = {
        email: form.register('email', rules.email),
        name: form.register('name', rules.name),
        phone: form.register('phone', rules.phone),
    };
    const contactMissing = !contactByEmail && !contactByPhone;
    const payment = useMutation({
        /** Starts hosted payment for the scanned sticker. */
        mutationFn: (values: CheckoutContactValues) => submitRecoveryActivation(code, values),
        retry: false,
        /** Opens the hosted payment page. */
        onSuccess(checkoutUrl) {
            window.location.assign(checkoutUrl);
        },
    });
    const isSubmitting = payment.isPending || payment.isSuccess;

    /** Submits valid contact details for activation payment. */
    const onSubmit = form.handleSubmit((values) => {
        if (customer && !contactMissing && !isSubmitting) payment.mutate(values);
    });

    /** Refreshes the recovery page with the server-verified customer session. */
    function onVerified() {
        void queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
        router.refresh();
    }

    return {
        form,
        contactInputs,
        contactMissing,
        onVerified,
        onSubmit,
        isSubmitting,
        paymentError: payment.isError,
    };
}
