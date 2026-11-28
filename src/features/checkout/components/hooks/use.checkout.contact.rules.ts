import { useTranslations } from 'next-intl';
import type { CheckoutContactValues } from '@/features/checkout/utils/checkout.types';

/** Supplies the shared validation rules for customer contact details. */
export function useCheckoutContactRules() {
    const t = useTranslations('Checkout.details');
    return {
        email: {
            required: t('emailRequired'),
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('emailInvalid') },
        },
        name: {
            /** Requires a customer name for checkout. */
            validate: (value: string) => value.trim().length > 0 || t('nameRequired'),
        },
        phone: {
            /** Requires a reachable phone value when phone contact is enabled. */
            validate: (
                value: string,
                { contactByPhone }: Pick<CheckoutContactValues, 'contactByPhone'>,
            ) => !contactByPhone || value.trim().length > 0 || t('phoneRequired'),
        },
    };
}
