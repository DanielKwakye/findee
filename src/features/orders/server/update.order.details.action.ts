"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateOrderId } from "@/features/orders/utils/order.validations";
import { validateCheckoutValues, validateCheckoutAllocation } from "@/features/checkout/utils/checkout.validations";
import { getCheckoutPlans } from "@/features/checkout/server/get.checkout.plans.action";
import { checkoutOrderPlans } from "@/features/checkout/data/checkout.order.plans";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";

/** Updates an order's purchase, customer contact, and delivery information. */
export async function updateOrderDetails(id: string, values: CheckoutValues): Promise<string> {
    await requireAdmin();
    validateOrderId(id);
    validateCheckoutValues(values);
    const plans = await getCheckoutPlans();
    return db.$transaction(async transaction => {
        const order = await transaction.order.findUnique({ where: { id }, select: {
            number: true, customerId: true, customer: { select: { email: true } }, planDetail: true, defaultReachoutModes: true,
        } });
        if (!order) throw new Error("Order not found");
        if (values.email !== order.customer.email) throw new Error("Order customer cannot be changed");
        const plansForOrder = plans.map(plan => checkoutOrderPlans[plan.id] === order.planDetail.plan
            ? { ...plan, ...order.planDetail } : plan);
        const plan = validateCheckoutAllocation(values, plansForOrder);
        const name = values.name.trim();
        const phone = values.phone.trim();
        if (name || phone) await transaction.user.update({ where: { id: order.customerId },
            data: { ...(name ? { name } : {}), ...(phone ? { phone } : {}) }, select: { id: true } });
        await transaction.order.update({ where: { id }, data: {
            planDetail: { plan: checkoutOrderPlans[plan.id], quantity: plan.quantity, price: plan.price,
                currency: plan.currency, maxRecoveryProfiles: plan.maxRecoveryProfiles,
                allocations: values.variants.map(variant => ({ variant, quantity: Number(values.allocation[variant]) })) },
            defaultReachoutModes: { email: values.contactByEmail, phone: values.contactByPhone, chat: order.defaultReachoutModes.chat },
            showOwnerName: values.showName, shippingAddress: values.shippingAddress.trim(),
            deliveryInstructions: values.deliveryInstructions.trim() || null,
        }, select: { id: true } });
        return order.number;
    });
}
