import {Checkbox} from "@/components/core/ui/checkbox";
import type {PortalTableColumnDef} from "@/components/platform/utils/portal.table.types";

/** Creates the optional checkbox column with page-scoped select-all behavior. */
export function createPortalTableSelectionColumn<T extends object>(labels: {selectPage: string; selectRow: string}, disabled: boolean): PortalTableColumnDef<T> {
    return {
        id: "portal-selection",
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        header: ({table}) => (
            <Checkbox aria-label={labels.selectPage} disabled={disabled || table.getRowModel().rows.length === 0}
                checked={table.getIsAllPageRowsSelected()} indeterminate={table.getIsSomePageRowsSelected()}
                onCheckedChange={checked => table.toggleAllPageRowsSelected(checked)} />
        ),
        cell: ({row}) => (
            <Checkbox aria-label={labels.selectRow} disabled={disabled || !row.getCanSelect()}
                checked={row.getIsSelected()} onCheckedChange={checked => row.toggleSelected(checked)} />
        ),
    };
}
