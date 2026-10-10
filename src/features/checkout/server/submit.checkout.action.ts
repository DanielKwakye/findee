"use server";

import { getCheckoutPlans } from "@/features/checkout/server/get.checkout.plans.action";
import { validateCheckoutValues, validateCheckoutAllocation } from "@/features/checkout/utils/checkout.validations";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { getCustomerUser } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/client";
import { generateReferenceCode } from "@/components/platform/utils/reference.code.utils";
import { checkoutOrderPlans } from "@/features/checkout/data/checkout.order.plans";

/** Validates and records submitted checkout information for order processing. */
export async function submitCheckout(values: CheckoutValues): Promise<string> {
    const customer = await getCustomerUser();
    if (!customer) throw new Error("Customer authentication required");
    validateCheckoutValues(values);
    const plans = await getCheckoutPlans();
    const plan = validateCheckoutAllocation(values, plans);

    const name = values.name.trim();
    const phone = values.phone.trim();
    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const order = await db.$transaction(async transaction => {
                if (name || phone) {
                    await transaction.user.update({
                        where: { id: customer.id },
                        data: { ...(name ? { name } : {}), ...(phone ? { phone } : {}) },
                        select: { id: true },
                    });
                }
                return transaction.order.create({
                    data: {
                        number: generateReferenceCode(),
                        customerId: customer.id,
                        planDetail: {
                            plan: checkoutOrderPlans[plan.id],
                            quantity: plan.quantity,
                            price: plan.price,
                            currency: plan.currency,
                            maxRecoveryProfiles: plan.maxRecoveryProfiles,
                            allocations: values.variants.map(variant => ({ variant, quantity: Number(values.allocation[variant]) })),
                        },
                        defaultReachoutModes: { email: values.contactByEmail, phone: values.contactByPhone, chat: false },
                        showOwnerName: values.showName,
                        shippingAddress: values.shippingAddress.trim(),
                        deliveryInstructions: values.deliveryInstructions.trim() || null,
                        cancelledAt: null,
                        cancellationReason: null,
                        completedAt: null,
                    },
                    select: { number: true },
                });
            });
            return order.number;
        } catch (error) {
            if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
        }
    }
    throw new Error("Unable to generate a unique order number. Please try again.");
}
