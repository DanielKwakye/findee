'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { db } from '@/lib/db';
import type { UpdateAdminDetailsValues } from '@/features/users/utils/users.types';
import { UserDepartments } from '@/features/users/utils/users.constants';

/** Updates an administrator's display name for an authorized administrator. */
export async function updateAdminDetails(values: UpdateAdminDetailsValues) {
    const user = await requireAdmin();
    if (
        !values ||
        typeof values.id !== 'string' ||
        !/^[a-f\d]{24}$/i.test(values.id) ||
        typeof values.name !== 'string' ||
        values.name.trim().length > 100 ||
        !Array.isArray(values.departments) ||
        values.departments.some(
            (department) => !Object.values<string>(UserDepartments).includes(department),
        )
    ) {
        throw new Error('Invalid administrator details update');
    }
    const result = await db.user.updateMany({
        where: {
            id: values.id,
            role: 'ADMIN',
            OR: [{ closedAt: null }, { closedAt: { isSet: false } }],
        },
        data: {
            name: values.name.trim() || null,
            ...(user.departments.includes(UserDepartments.directors)
                ? { departments: [...new Set(values.departments)] }
                : {}),
        },
    });
    if (result.count !== 1) throw new Error('Administrator account is unavailable');
}
