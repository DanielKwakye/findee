import type { CheckoutValues } from '@/features/checkout/utils/checkout.types';

export const initialOrderValues: CheckoutValues = {
    variants: [],
    plan: 'custom',
    customQuantity: 1,
    allocation: {},
    email: '',
    name: '',
    phone: '',
    contactByEmail: false,
    contactByPhone: false,
    showName: false,
    shippingAddress: '',
    country: 'Canada',
    state: '',
    postalCode: '',
    deliveryInstructions: '',
};
