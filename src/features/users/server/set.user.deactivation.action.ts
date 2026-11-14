'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { db } from '@/lib/db';
import { UserDepartments } from '@/features/users/utils/users.constants';

/** Temporarily suspends or restores portal access for an open customer account. */
export async function setUserDeactivation({
    id,
    deactivated,
}: {
    id: string;
    deactivated: boolean;
}) {
    const user = await requireAdmin();
    if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id) || typeof deactivated !== 'boolean') {
        throw new Error('Invalid user account update');
    }
    const result = await db.user.updateMany({
        where: {
            id,
            ...(user.departments.includes(UserDepartments.directors)
                ? {}
                : { role: 'CUSTOMER' as const }),
            OR: [{ closedAt: null }, { closedAt: { isSet: false } }],
        },
        data: { deactivatedAt: deactivated ? new Date() : null, otp: null, otpCreatedAt: null },
    });
    if (result.count !== 1) throw new Error('User account is unavailable');
}
