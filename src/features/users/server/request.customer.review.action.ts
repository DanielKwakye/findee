'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { db } from '@/lib/db';
import { sendReviewRequest } from '@/features/notifications/server/send.review.request';

/** Requests a customer review on behalf of an authorized administrator. */
export async function requestCustomerReview(id: string): Promise<{ email: string }> {
    await requireAdmin();
    if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id)) throw new Error('Invalid customer');
    const customer = await db.user.findFirst({
        where: { id, role: 'CUSTOMER', OR: [{ closedAt: null }, { closedAt: { isSet: false } }] },
        select: { id: true, name: true, email: true },
    });
    if (!customer) throw new Error('Customer account is unavailable');
    await sendReviewRequest(customer);
    return { email: customer.email };
}
