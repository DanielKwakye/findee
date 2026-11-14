import { requireAdmin } from '@/features/auth/server/auth.session';
import type { Metadata } from 'next';
import messages from '@/translations/en.json';
import AdminsTable from '@/features/users/components/ui/admins-table';
import { UserDepartments } from '@/features/users/utils/users.constants';

export const metadata: Metadata = { title: messages.PageMetadata.titles.admins };

/** Presents administrator account management to authorized administrators. */
export default async function AdminsPage() {
    const user = await requireAdmin();
    return <AdminsTable isDirector={user.departments.includes(UserDepartments.directors)} />;
}
