import type { OrderPlan } from "@/generated/client";
import type { CheckoutPlan } from "@/features/checkout/utils/checkout.types";

export const checkoutOrderPlans: Record<CheckoutPlan["id"], OrderPlan> = {
    personal: "Starter",
    family: "Pro",
    business: "Premium",
};
