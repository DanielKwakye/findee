import 'dotenv/config';
import { PrismaClient } from '@/generated/client';
import { UserDepartments } from '@/features/users/utils/users.constants';

/** Adds director membership to the earliest-created user without replacing other departments. */
async function seedFirstDirector() {
    const db = new PrismaClient();
    try {
        const user = await db.user.findFirst({
            orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            select: { id: true, departments: true },
        });
        if (!user) {
            console.log('No users found.');
            return;
        }
        const departments = [...new Set([...user.departments, ...Object.values(UserDepartments)])];
        if (departments.length === user.departments.length) {
            console.log('The first user already belongs to all departments.');
            return;
        }
        await db.user.update({
            where: { id: user.id },
            data: { departments },
        });
        console.log('Added all departments to the first user.');
    } finally {
        await db.$disconnect();
    }
}

seedFirstDirector().catch(() => {
    console.error('Unable to seed the first director.');
    process.exitCode = 1;
});
