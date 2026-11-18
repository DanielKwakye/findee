'use server';

import { randomUUID } from 'node:crypto';
import { requireAdmin } from '@/features/auth/server/auth.session';
import { sendEmail } from '@/features/notifications/server/send.email';
import { prepareAdminTemporaryPassword } from '@/features/users/server/admin.temporary.password';
import { UserDepartments } from '@/features/users/utils/users.constants';
import { db } from '@/lib/db';

/** Resets another administrator's credentials and emails a temporary password. */
export async function resetAdminPassword(id: string) {
    const director = await requireAdmin({ department: UserDepartments.directors });
    if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id) || id.toLowerCase() === director.id) {
        throw new Error('Invalid administrator password reset');
    }
    const where = {
        id,
        role: 'ADMIN' as const,
        AND: [
            { OR: [{ closedAt: null }, { closedAt: { isSet: false } }] },
            { OR: [{ deactivatedAt: null }, { deactivatedAt: { isSet: false } }] },
        ],
    };
    const admin = await db.user.findFirst({
        where,
        select: {
            email: true,
            passwordHash: true,
            mustChangePassword: true,
            passwordResetVersion: true,
        },
    });
    if (!admin) throw new Error('Administrator account is unavailable');

    const { passwordHash, message } = await prepareAdminTemporaryPassword(
        admin.email,
        'AdminPasswordReset',
    );
    const passwordResetVersion = randomUUID();
    const updated = await db.user.updateMany({
        where: {
            ...where,
            OR: admin.passwordHash
                ? [{ passwordHash: admin.passwordHash }]
                : [{ passwordHash: null }, { passwordHash: { isSet: false } }],
        },
        data: { passwordHash, mustChangePassword: true, passwordResetVersion },
    });
    if (updated.count !== 1) throw new Error('Administrator credentials changed');

    try {
        await sendEmail({
            ...message,
            idempotencyKey: `admin-password-reset/${passwordResetVersion}`,
        });
    } catch (error) {
        await db.user.updateMany({
            where: { id, passwordHash, passwordResetVersion },
            data: {
                passwordHash: admin.passwordHash,
                mustChangePassword: admin.mustChangePassword,
                passwordResetVersion: admin.passwordResetVersion,
            },
        });
        throw error;
    }
}
