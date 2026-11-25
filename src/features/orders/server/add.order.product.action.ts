'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { assignOrderConfirmationProducts } from '@/features/orders/utils/order.confirmation.utils';
import { validateOrderId } from '@/features/orders/utils/order.validations';
import { db } from '@/lib/db';

/** Assigns a selected sticker to the order and configures it for its customer. */
export async function addOrderProduct(orderId: string, code: string, expectedUpdatedAt: Date) {
    await requireAdmin();
    validateOrderId(orderId);
    if (typeof code !== 'string' || !code || code.length > 255)
        throw new Error('Invalid product code');
    if (!(expectedUpdatedAt instanceof Date) || !Number.isFinite(expectedUpdatedAt.getTime()))
        throw new Error('Invalid product revision');

    await db.$transaction(async (transaction) => {
        const product = await transaction.product.findUniqueOrThrow({
            where: { code, published: true, updatedAt: expectedUpdatedAt },
            select: { id: true, orderId: true },
        });
        if (product.orderId === orderId) return;
        const updatedAt = new Date();
        const order = await transaction.order.update({
            where: { id: orderId },
            data: { updatedAt },
            select: { id: true, customerId: true, defaultReachoutModes: true },
        });
        if (product.orderId) {
            await transaction.order.updateMany({
                where: { id: product.orderId },
                data: { updatedAt },
            });
        }
        await assignOrderConfirmationProducts(transaction, order, [product.id], expectedUpdatedAt);
    });
}
