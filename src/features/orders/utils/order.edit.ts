import { checkoutOrderPlans } from "@/features/checkout/data/checkout.order.plans";
import { checkoutVariants } from "@/features/checkout/data/checkout.variants";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";
import type { OrderDetails } from "@/features/orders/utils/order.types";

/** Converts persisted order details into editable form values. */
export function getOrderEditValues(order: OrderDetails): CheckoutValues {
    return {
        variants: checkoutVariants.filter(variant => order.planDetail.allocations.some(allocation => allocation.variant === variant.id)).map(variant => variant.id),
        plan: Object.entries(checkoutOrderPlans).find(([, value]) => value === order.planDetail.plan)?.[0] ?? "",
        allocation: Object.fromEntries(order.planDetail.allocations.map(allocation => [allocation.variant, allocation.quantity])),
        email: order.customer.email, name: order.customer.name ?? "", phone: order.customer.phone ?? "",
        contactByEmail: order.defaultReachoutModes.email, contactByPhone: order.defaultReachoutModes.phone,
        showName: order.showOwnerName, shippingAddress: order.shippingAddress ?? "", deliveryInstructions: order.deliveryInstructions ?? "",
    };
}
