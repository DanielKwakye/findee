'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { db } from '@/lib/db';
import { validateOrderId } from '@/features/orders/utils/order.validations';
import type { OrderPaymentDateUpdate } from '@/features/orders/utils/order.types';

/** Saves an administrator's recorded payment date for an existing order. */
export async function updateOrderPaymentDate(values: OrderPaymentDateUpdate) {
    await requireAdmin();
    validateOrderId(values?.id);
    if (typeof values.paymentAt !== 'string' || !Number.isFinite(Date.parse(values.paymentAt)))
        throw new Error('Invalid payment date');
    await db.order.update({
        where: { id: values.id },
        data: { paymentAt: new Date(values.paymentAt) },
        select: { id: true },
    });
}
