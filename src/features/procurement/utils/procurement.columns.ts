import {createElement} from "react";
import TypographyBody from "@/components/core/ui/typography-body";
import type {PortalTableColumnDef} from "@/components/platform";
import type {ProcurementProduct} from "@/features/procurement/utils/procurement.types";

const statusStyles = {
    inactive: "bg-muted text-muted-foreground",
    requested: "bg-warning/10 text-warning",
    received: "bg-success/10 text-success",
};

/** Defines the inventory fields displayed in the procurement table. */
export function getProcurementColumns(labels: {code: string; published: string; procurementStatus: string; inactive: string; requested: string; received: string; createdAt: string; yes: string; no: string}, formatDate: (date: Date) => string): PortalTableColumnDef<ProcurementProduct>[] {
    return [
        {accessorKey: "code", header: labels.code},
        {accessorKey: "published", header: labels.published, cell: ({row}) => {
            const props = {children: row.original.published ? "✅" : "❌", "aria-label": row.original.published ? labels.yes : labels.no};
            return createElement("span", props);
        }},
        {accessorKey: "procurementStatus", header: labels.procurementStatus, cell: ({row}) => {
            const props = {
                className: `rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[row.original.procurementStatus]}`,
                children: labels[row.original.procurementStatus],
            };
            return createElement(TypographyBody, props);
        }},
        {accessorKey: "createdAt", header: labels.createdAt, cell: ({row}) => formatDate(row.original.createdAt)},
    ];
}
