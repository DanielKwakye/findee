import type { CheckoutVariant } from "@/features/checkout/data/checkout.variants";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";

/** Distributes a sticker quantity evenly across the selected variants. */
export function distributeCheckoutQuantity(variants: CheckoutVariant[], quantity: number): CheckoutValues["allocation"] {
    if (variants.length === 0) return {};
    const share = Math.floor(quantity / variants.length);
    const remainder = quantity % variants.length;
    return Object.fromEntries(variants.map((variant, index) => [variant, share + (index < remainder ? 1 : 0)]));
}
