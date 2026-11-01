import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";

export const initialOrderValues: CheckoutValues = {
    variants: [], plan: "custom", customQuantity: 20, allocation: {},
    email: "", name: "", phone: "", contactByEmail: false, contactByPhone: false,
    showName: false, shippingAddress: "", deliveryInstructions: "",
};
