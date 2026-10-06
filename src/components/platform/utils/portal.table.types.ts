import type {ReactNode} from "react";
import type {ColumnDef, ReactTable, RowSelectionState, SortingState} from "@tanstack/react-table";
import type {portalTableFeatures} from "@/components/platform/data/portal.table";

export type PortalTableColumnDef<T extends object> = ColumnDef<typeof portalTableFeatures, T>;
export type PortalTableInstance<T extends object> = ReactTable<typeof portalTableFeatures, T>;
export type PortalTablePaginationState = {page: number; pageSize: number};
export type PortalTableServerPagination = PortalTablePaginationState & {total: number};
export type PortalTableRowSelection = RowSelectionState;

export type PortalTableProps<T extends object> = {
    data: T[];
    columns: PortalTableColumnDef<T>[];
    initialPageSize?: number;
    isLoading?: boolean;
    showSearch?: boolean;
    showColumnSelectionButton?: boolean;
    showPageSizeSelector?: boolean;
    search?: string;
    onSearchChange?: (search: string) => void;
    onSortingChange?: (sorting: SortingState) => void;
    rowSelection?: PortalTableRowSelection;
    isRowSelectable?: (row: T) => boolean;
    onRowSelectionChange?: (selection: PortalTableRowSelection) => void;
    onRowClick?: (row: T) => void;
    toolbarActions?: ReactNode;
    className?: string;
} & ({
    enableRowSelection: boolean;
    getRowId: (row: T) => string;
} | {
    enableRowSelection?: false;
    getRowId?: (row: T) => string;
}) & ({
    pagination: PortalTableServerPagination;
    onPaginationChange: (pagination: PortalTablePaginationState) => void;
} | {
    pagination?: undefined;
    onPaginationChange?: undefined;
});

export type PortalTableControlsProps<T extends object> = {
    table: PortalTableInstance<T>;
    isLoading?: boolean;
};

export type PortalTableToolbarProps<T extends object> = PortalTableControlsProps<T> & {
    showSearch?: boolean;
    showColumnSelectionButton?: boolean;
    showPageSizeSelector?: boolean;
    toolbarActions?: ReactNode;
};
