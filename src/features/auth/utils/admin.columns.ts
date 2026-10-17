import type { PortalTableColumnDef } from "@/components/platform";
import type { AdminRow } from "@/features/auth/utils/auth.types";

/** Defines the administrator table's account and password setup columns. */
export function getAdminColumns(labels: {
    name: string; email: string; status: string; pending: string; ready: string; noName: string;
}): PortalTableColumnDef<AdminRow>[] {
    return [
        { accessorKey: "name", header: labels.name, cell: ({ row }) => row.original.name || labels.noName },
        { accessorKey: "email", header: labels.email },
        { id: "status", header: labels.status, accessorFn: row => row.mustChangePassword ? labels.pending : labels.ready },
    ];
}
