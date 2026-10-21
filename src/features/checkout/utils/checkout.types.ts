import type { CheckoutVariant } from "@/features/checkout/data/checkout.variants";

export type CheckoutCustomer = {
    email: string;
    name: string | null;
    phone: string | null;
};

export type CheckoutPlan = {
    id: "personal" | "family" | "custom";
    title: "Starter" | "Family" | "Custom";
    price: number;
    currency: string;
    quantity: number;
    quantityIsMinimum?: boolean;
    minimumQuantity?: number;
    unitPrices?: { maximumQuantity: number | null; prices: Record<CheckoutVariant, number> }[];
    maxRecoveryProfiles: number | null;
};

export type CheckoutValues = {
    variants: CheckoutVariant[];
    plan: string;
    customQuantity?: number | "";
    allocation: Partial<Record<CheckoutVariant, number | "">>;
    email: string;
    name: string;
    phone: string;
    contactByEmail: boolean;
    showName: boolean;
    contactByPhone: boolean;
    shippingAddress: string;
    postalCode?: string;
    deliveryInstructions: string;
};
