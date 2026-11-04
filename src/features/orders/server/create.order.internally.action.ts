'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { normalizeEmail } from '@/features/auth/utils/auth.validation';
import { validateCheckoutValues } from '@/features/checkout/utils/checkout.validations';
import type { OrderFormValues } from '@/features/orders/utils/order.types';
import { sendOrderInvoice } from '@/features/orders/server/order.invoice';
import { createOrder } from '@/features/orders/server/order.creation';
import { db } from '@/lib/db';

/** Creates an order for a customer on behalf of authorized staff. */
export async function createOrderInternally(
    values: OrderFormValues,
    orderReference: string,
): Promise<string> {
    await requireAdmin();
    if (
        typeof orderReference !== 'string' ||
        !/^[A-Z0-9]{3}(?:-[A-Z0-9]{3}){3}$/.test(orderReference) ||
        (values.customerPaid !== undefined && typeof values.customerPaid !== 'boolean')
    )
        throw new Error('Invalid internal order');
    validateCheckoutValues(values);
    const email = normalizeEmail(values.email);
    const customer = await db.user.upsert({
        where: { email },
        create: {
            email,
            name: values.name.trim() || null,
            phone: values.phone.trim() || null,
            role: 'CUSTOMER',
        },
        update: {},
        select: { id: true, role: true },
    });
    if (customer.role !== 'CUSTOMER') throw new Error('Customer account not found');
    const existing = await db.order.findUnique({
        where: { number: orderReference },
        select: { customerId: true, paymentAt: true },
    });
    if (existing && existing.customerId !== customer.id)
        throw new Error('Order does not belong to this customer');
    if (!existing)
        await createOrder(
            customer.id,
            { ...values, email },
            orderReference,
            undefined,
            values.customerPaid ? new Date() : null,
        );
    if (!existing?.paymentAt) await sendOrderInvoice(orderReference);
    return orderReference;
}
