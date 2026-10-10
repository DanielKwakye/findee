import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";

export const initialOrderValues: CheckoutValues = {
    variants: [], plan: "", allocation: {},
    email: "", name: "", phone: "", contactByEmail: false, contactByPhone: false,
    showName: false, shippingAddress: "", deliveryInstructions: "",
};
