'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { validateOrderId } from '@/features/orders/utils/order.validations';
import { db } from '@/lib/db';

/** Loads an order's assignment settings and associated stickers. */
export async function getOrderProducts(orderId: string) {
    await requireAdmin();
    validateOrderId(orderId);
    return db.order.findUniqueOrThrow({
        where: { id: orderId },
        select: {
            autoAssign: true,
            planDetail: { select: { quantity: true } },
            products: {
                orderBy: { code: 'asc' },
                select: { code: true, variant: true },
            },
        },
    });
}
