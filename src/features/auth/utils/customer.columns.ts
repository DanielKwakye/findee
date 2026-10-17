import type { PortalTableColumnDef } from "@/components/platform";
import type { CustomerRow } from "@/features/auth/utils/auth.types";

/** Defines customer contact and account status columns. */
export function getCustomerColumns(labels: {
    name: string; email: string; phone: string; status: string; active: string; closed: string; noName: string; createdAt: string; lastVisited: string; notRecorded: string;
    deactivated: string;
}, formatDate: (date: Date) => string): PortalTableColumnDef<CustomerRow>[] {
    return [
        { accessorKey: "name", header: labels.name, cell: ({ row }) => row.original.name || labels.noName },
        { accessorKey: "email", header: labels.email },
        { accessorKey: "phone", header: labels.phone, cell: ({ row }) => row.original.phone || labels.noName },
        { accessorKey: "createdAt", header: labels.createdAt, cell: ({ row }) => formatDate(row.original.createdAt) },
        { accessorKey: "lastPortalVisitedAt", header: labels.lastVisited, cell: ({ row }) => row.original.lastPortalVisitedAt ? formatDate(row.original.lastPortalVisitedAt) : labels.notRecorded },
        { id: "status", header: labels.status, accessorFn: row => row.closedAt ? labels.closed : row.deactivatedAt ? labels.deactivated : labels.active },
    ];
}
