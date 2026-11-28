'use server';

import { db } from '@/lib/db';
import { normalizeProductCode } from '@/features/products/utils/product.code';
import { availableProducts } from '@/features/products/utils/product.availability';
import { checkoutVariants } from '@/features/checkout/data/checkout.variants';
import { getCheckoutPlans } from '@/features/checkout/server/get.checkout.plans.action';
import { getCheckoutSubtotal } from '@/features/checkout/utils/checkout.pricing';

/** Retrieves the public owner details and permitted contact modes for a recovery code. */
export async function getRecoveryProduct(incomingCode: string) {
    if (typeof incomingCode !== 'string') return null;
    const code = normalizeProductCode(incomingCode);
    if (!code || code.length > 255) return null;
    const product = await db.product.findUnique({
        where: {
            code,
            published: true,
            assignedToId: { not: null },
            assignedTo: { is: { OR: [{ closedAt: null }, { closedAt: { isSet: false } }] } },
        },
        select: {
            published: true,
            reachoutModes: true,
            order: { select: { showOwnerName: true } },
            assignedTo: { select: { name: true, email: true, phone: true } },
        },
    });
    if (!product?.assignedTo) {
        const available = await db.product.findUnique({
            where: { code, AND: availableProducts },
            select: { variant: true },
        });
        const variant = checkoutVariants.find(({ id }) => id === available?.variant);
        if (!variant) return null;
        const plan = (await getCheckoutPlans()).find(({ id }) => id === 'custom');
        if (!plan) throw new Error('Sticker pricing is unavailable');
        return {
            status: 'available' as const,
            variant: variant.id,
            plan: {
                id: plan.id,
                title: plan.title,
                currency: plan.currency,
                maxRecoveryProfiles: plan.maxRecoveryProfiles,
                quantity: 1,
                minimumQuantity: 1,
                price: getCheckoutSubtotal(plan, variant.id, 1),
                shippingCost: 0,
            },
        };
    }
    return {
        status: 'assigned' as const,
        published: product.published,
        reachoutModes: product.reachoutModes,
        assignedTo: {
            name: product.order?.showOwnerName ? product.assignedTo.name : null,
            email: product.reachoutModes?.email ? product.assignedTo.email : null,
            phone: product.reachoutModes?.phone ? product.assignedTo.phone : null,
        },
    };
}
