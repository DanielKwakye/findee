import type { PortalTableColumnDef } from '@/components/platform';
import type { AdminRow } from '@/features/users/utils/users.types';

/** Defines the administrator table's account and password setup columns. */
export function getAdminColumns(
    labels: {
        name: string;
        email: string;
        departments: string;
        departmentNames: Record<string, string>;
        status: string;
        pending: string;
        ready: string;
        noName: string;
        lastVisited: string;
        notRecorded: string;
    },
    formatDate: (date: Date) => string,
): PortalTableColumnDef<AdminRow>[] {
    return [
        {
            accessorKey: 'name',
            header: labels.name,
            cell: ({ row }) => row.original.name || labels.noName,
        },
        { accessorKey: 'email', header: labels.email },
        {
            id: 'departments',
            header: labels.departments,
            accessorFn: (row) =>
                row.departments
                    .map((department) => labels.departmentNames[department] ?? department)
                    .join(', ') || labels.noName,
        },
        {
            accessorKey: 'lastPortalVisitedAt',
            header: labels.lastVisited,
            cell: ({ row }) =>
                row.original.lastPortalVisitedAt
                    ? formatDate(row.original.lastPortalVisitedAt)
                    : labels.notRecorded,
        },
        {
            id: 'status',
            header: labels.status,
            accessorFn: (row) => (row.mustChangePassword ? labels.pending : labels.ready),
        },
    ];
}
