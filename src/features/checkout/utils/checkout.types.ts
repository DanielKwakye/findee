import type { CheckoutVariant } from "@/features/checkout/data/checkout.variants";

export type CheckoutPlan = {
    id: "personal" | "family" | "business";
    title: "Starter" | "Family" | "Business";
    price: number;
    currency: string;
    quantity: number;
    quantityIsMinimum?: boolean;
    maxRecoveryProfiles: number | null;
};

export type CheckoutValues = {
    variants: CheckoutVariant[];
    plan: string;
    allocation: Partial<Record<CheckoutVariant, number | "">>;
    email: string;
    name: string;
    phone: string;
    contactByEmail: boolean;
    showName: boolean;
    contactByPhone: boolean;
    shippingAddress: string;
};
