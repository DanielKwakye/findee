import type { CheckoutPlan, CheckoutValues } from '@/features/checkout/utils/checkout.types';
import { checkoutVariants, type CheckoutVariant } from '@/features/checkout/data/checkout.variants';

/** Resolves a variant's unit rate using the combined order quantity. */
export function getCheckoutUnitPrice(
    plan: CheckoutPlan,
    variant: CheckoutVariant,
    quantity: number = plan.quantity,
): number {
    const tier = plan.unitPrices?.find(
        (option) => option.maximumQuantity === null || quantity <= option.maximumQuantity,
    );
    if (!tier) throw new Error('No price configured for this quantity');
    return tier.prices[variant];
}

/** Calculates a variant's currency subtotal from its allocated sticker count. */
export function getCheckoutSubtotal(
    plan: CheckoutPlan,
    variant: CheckoutVariant,
    quantity: number | '' | undefined,
): number {
    const count =
        typeof quantity === 'number' && Number.isSafeInteger(quantity) && quantity >= 0
            ? quantity
            : 0;
    const unitPrice = Math.round(getCheckoutUnitPrice(plan, variant, count) * 100_000);
    return Math.round((count * unitPrice) / 1_000) / 100;
}

/** Applies a plan's quantity pricing to the customer's selected sticker count. */
export function getCheckoutPlanPrice(
    plan: CheckoutPlan,
    quantity: CheckoutValues['customQuantity'],
    allocation?: CheckoutValues['allocation'],
    includeShipping = true,
): CheckoutPlan {
    if (!plan.unitPrices) return plan;
    const count =
        typeof quantity === 'number' &&
        Number.isSafeInteger(quantity) &&
        quantity >= (plan.minimumQuantity ?? 1)
            ? quantity
            : plan.quantity;
    const selected = { ...plan, quantity: count };
    const quantities = allocation ?? { Everyday: count };
    const cents = checkoutVariants.reduce(
        (sum, variant) =>
            sum +
            Math.round(getCheckoutSubtotal(selected, variant.id, quantities[variant.id]) * 100),
        0,
    );
    const shippingCents = includeShipping
        ? checkoutVariants.reduce((highest, variant) => {
              const quantity = Number(quantities[variant.id] ?? 0);
              if (quantity <= 0 || !plan.shippingPrices) return highest;
              const tier = plan.shippingPrices.find(
                  (option) => option.maximumQuantity === null || quantity <= option.maximumQuantity,
              );
              if (!tier) throw new Error('No shipping price configured for this quantity');
              return Math.max(highest, Math.round(tier.prices[variant.id] * 100));
          }, 0)
        : 0;
    return { ...selected, shippingCost: shippingCents / 100, price: (cents + shippingCents) / 100 };
}
