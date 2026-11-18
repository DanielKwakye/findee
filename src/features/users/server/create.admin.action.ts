'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { isValidEmail, normalizeEmail } from '@/features/auth/utils/auth.validation';
import { sendEmail } from '@/features/notifications/server/send.email';
import { prepareAdminTemporaryPassword } from '@/features/users/server/admin.temporary.password';
import type { AddAdminValues } from '@/features/users/utils/users.types';
import { db } from '@/lib/db';
import { UserDepartments } from '@/features/users/utils/users.constants';

/** Creates a new administrator account for an authorized administrator. */
export async function createAdmin(values: AddAdminValues) {
    const user = await requireAdmin();
    if (!user.departments.includes(UserDepartments.directors)) throw new Error('Unauthorized');
    if (
        !values ||
        typeof values.email !== 'string' ||
        !isValidEmail(values.email) ||
        typeof values.name !== 'string' ||
        values.name.trim().length > 100 ||
        !Array.isArray(values.departments) ||
        values.departments.some(
            (department) => !Object.values<string>(UserDepartments).includes(department),
        )
    ) {
        return { error: 'invalid' as const };
    }
    const email = normalizeEmail(values.email);
    if (await db.user.findUnique({ where: { email }, select: { id: true } }))
        return { error: 'duplicate' as const };
    const { passwordHash, message } = await prepareAdminTemporaryPassword(email);
    let admin;
    try {
        admin = await db.user.create({
            data: {
                email,
                name: values.name.trim() || null,
                passwordHash,
                role: 'ADMIN',
                departments: [...new Set(values.departments)],
                mustChangePassword: true,
            },
            select: { id: true },
        });
    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return { error: 'duplicate' as const };
        }
        throw error;
    }
    try {
        await sendEmail({
            ...message,
            idempotencyKey: `admin-invitation/${admin.id}`,
        });
    } catch {
        await db.user.deleteMany({
            where: { id: admin.id, mustChangePassword: true, passwordHash },
        });
        return { error: 'delivery' as const };
    }
    return { error: null };
}
