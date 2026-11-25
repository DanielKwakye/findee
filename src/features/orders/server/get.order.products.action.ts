'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { validateOrderId } from '@/features/orders/utils/order.validations';
import { db } from '@/lib/db';

/** Lists the stickers currently associated with an order. */
export async function getOrderProducts(orderId: string) {
    await requireAdmin();
    validateOrderId(orderId);
    return db.product.findMany({
        where: { orderId },
        orderBy: { code: 'asc' },
        select: { code: true, variant: true },
    });
}
