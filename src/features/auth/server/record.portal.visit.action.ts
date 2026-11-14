'use server';

import { requireAdmin, requireCustomer } from '@/features/auth/server/auth.session';
import type { AuthRole } from '@/features/auth/utils/auth.types';
import { db } from '@/lib/db';

/** Records customer portal visits at most once per five-minute interval. */
export async function recordPortalVisit(role: AuthRole) {
    if (role !== 'ADMIN' && role !== 'CUSTOMER') throw new Error('Invalid user role');
    const user = role === 'ADMIN' ? await requireAdmin() : await requireCustomer();
    const now = new Date();
    await db.user.updateMany({
        where: {
            id: user.id,
            role: user.role,
            AND: [
                { OR: [{ closedAt: null }, { closedAt: { isSet: false } }] },
                {
                    OR: [
                        { lastPortalVisitedAt: null },
                        { lastPortalVisitedAt: { isSet: false } },
                        { lastPortalVisitedAt: { lte: new Date(now.getTime() - 5 * 60_000) } },
                    ],
                },
            ],
        },
        data: { lastPortalVisitedAt: now },
    });
}
