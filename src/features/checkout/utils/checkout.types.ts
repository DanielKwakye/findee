import type { CheckoutVariant } from '@/features/checkout/data/checkout.variants';

export type CheckoutCustomer = {
    email: string;
    name: string | null;
    phone: string | null;
};

export type CheckoutPreviewHandle = {
    open: (values: CheckoutValues, plan: CheckoutPlan) => void;
};

export type CheckoutPlan = {
    id: 'personal' | 'family' | 'custom';
    title: string;
    price: number;
    currency: string;
    quantity: number;
    quantityIsMinimum?: boolean;
    minimumQuantity?: number;
    unitPrices?: { maximumQuantity: number | null; prices: Record<CheckoutVariant, number> }[];
    shippingPrices?: { maximumQuantity: number | null; prices: Record<CheckoutVariant, number> }[];
    shippingCost?: number;
    maxRecoveryProfiles: number | null;
};

export type CheckoutValues = {
    variants: CheckoutVariant[];
    plan: string;
    customQuantity?: number | '';
    allocation: Partial<Record<CheckoutVariant, number | ''>>;
    email: string;
    name: string;
    phone: string;
    contactByEmail: boolean;
    showName: boolean;
    contactByPhone: boolean;
    shippingAddress: string;
    state: string;
    country: string;
    postalCode?: string;
    deliveryInstructions: string;
};
