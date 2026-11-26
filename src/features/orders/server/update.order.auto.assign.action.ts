'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { validateOrderId } from '@/features/orders/utils/order.validations';
import { db } from '@/lib/db';

/** Saves an order's automatic assignment preference. */
export async function updateOrderAutoAssign(orderId: string, autoAssign: boolean) {
    await requireAdmin();
    validateOrderId(orderId);
    if (typeof autoAssign !== 'boolean') throw new Error('Invalid autoAssign value');
    return db.order.update({
        where: { id: orderId },
        data: { autoAssign },
        select: { autoAssign: true },
    });
}
