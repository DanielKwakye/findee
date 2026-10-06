import type {PortalTableColumnDef} from "@/components/platform";
import type {ProductRow} from "@/features/products/utils/product.types";

type ProductColumnLabels = {
    code: string; variant: string; published: string; reachoutModes: string;
    reservedBy: string; reservedAt: string; assignedTo: string; assignedAt: string;
    order: string; createdAt: string;
    yes: string; no: string; unset: string; none: string; phone: string; email: string; chat: string;
};

/** Defines product display columns and unpublished inventory actions. */
export function getProductColumns(labels: ProductColumnLabels, formatDate: (date: Date) => string, variants: Record<string, string>): PortalTableColumnDef<ProductRow>[] {
    return [
        {accessorKey: "code", header: labels.code},
        {accessorKey: "variant", header: labels.variant, cell: ({row}) => variants[row.original.variant] ?? row.original.variant},
        {accessorKey: "published", header: labels.published, cell: ({row}) => <span aria-label={row.original.published ? labels.yes : labels.no}>{row.original.published ? "✅" : "❌"}</span>},
        {id: "reachoutModes", header: labels.reachoutModes, enableSorting: false, cell: ({row}) => {
            const modes = row.original.reachoutModes;
            if (!modes) return labels.unset;
            return [modes.phone && labels.phone, modes.email && labels.email, modes.chat && labels.chat].filter(Boolean).join(", ") || labels.none;
        }},
        {id: "reservedBy", header: labels.reservedBy, enableSorting: false, cell: ({row}) => row.original.reservedBy?.name || row.original.reservedBy?.email || labels.unset},
        {accessorKey: "reservedAt", header: labels.reservedAt, cell: ({row}) => row.original.reservedAt ? formatDate(row.original.reservedAt) : labels.unset},
        {id: "assignedTo", header: labels.assignedTo, enableSorting: false, cell: ({row}) => row.original.assignedTo?.name || row.original.assignedTo?.email || labels.unset},
        {accessorKey: "assignedAt", header: labels.assignedAt, cell: ({row}) => row.original.assignedAt ? formatDate(row.original.assignedAt) : labels.unset},
        {id: "order", header: labels.order, enableSorting: false, cell: ({row}) => row.original.order?.number ?? labels.unset},
        {accessorKey: "createdAt", header: labels.createdAt, cell: ({row}) => formatDate(row.original.createdAt)},
    ];
}
