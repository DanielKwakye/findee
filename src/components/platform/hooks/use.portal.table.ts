"use client";

import {useMemo, useState} from "react";
import type {KeyboardEvent, MouseEvent} from "react";
import {isPortalTableControl} from "@/components/platform/utils/portal.table.utils";
import {useTranslations} from "next-intl";
import {functionalUpdate, useTable} from "@tanstack/react-table";
import type {PaginationState, RowSelectionState, SortingState, Updater} from "@tanstack/react-table";
import type {PortalTableProps} from "@/components/platform/utils/portal.table.types";
import {createPortalTableSelectionColumn} from "@/components/platform/ui/shared/portal-table-selection";
import {portalTableFeatures} from "@/components/platform/data/portal.table";

/** Manages reusable table behavior and coordinates server-owned pagination and filtering. */
export function usePortalTable<T extends object>(props: PortalTableProps<T>) {
    const {data, columns, pagination, onPaginationChange, onSearchChange, onSortingChange, search, getRowId} = props;
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [internalSelection, setInternalSelection] = useState<RowSelectionState>({});
    const rowSelection = props.rowSelection ?? internalSelection;
    const t = useTranslations("portalTable");
    const tableColumns = useMemo(() => props.enableRowSelection ? [
        createPortalTableSelectionColumn<T>({selectPage: t("selectPage"), selectRow: t("selectRow")}, props.isLoading ?? false),
        ...columns,
    ] : columns, [columns, props.enableRowSelection, props.isLoading, t]);
    const serverPaginated = pagination !== undefined;

    /** Keeps row selection available to both the table and the consuming feature. */
    function changeRowSelection(updater: Updater<RowSelectionState>) {
        const next = functionalUpdate(updater, rowSelection);
        setInternalSelection(next);
        props.onRowSelectionChange?.(next);
    }

    /** Adapts table pagination to the application's one-based page API. */
    function changePagination(updater: Updater<PaginationState>) {
        if (!pagination || !onPaginationChange) return;
        const current = {pageIndex: pagination.page - 1, pageSize: pagination.pageSize};
        const next = functionalUpdate(updater, current);
        onPaginationChange({
            page: next.pageSize !== current.pageSize ? 1 : next.pageIndex + 1,
            pageSize: next.pageSize,
        });
    }

    /** Updates search and returns to the first page when query results change. */
    function changeSearch(updater: Updater<string>) {
        const next = functionalUpdate(updater, search ?? globalFilter);
        setGlobalFilter(next);
        onSearchChange?.(next);
        if (pagination) onPaginationChange?.({page: 1, pageSize: pagination.pageSize});
    }

    /** Coordinates sorting with either local row models or a server query. */
    function changeSorting(updater: Updater<SortingState>) {
        const next = functionalUpdate(updater, sorting);
        setSorting(next);
        onSortingChange?.(next);
        if (pagination) onPaginationChange?.({page: 1, pageSize: pagination.pageSize});
    }

    const table = useTable({
        features: portalTableFeatures,
        data,
        columns: tableColumns,
        getRowId,
        initialState: {pagination: {pageIndex: 0, pageSize: props.initialPageSize ?? 10}},
        state: {
            globalFilter: search ?? globalFilter,
            sorting,
            rowSelection,
            ...(pagination ? {pagination: {pageIndex: pagination.page - 1, pageSize: pagination.pageSize}} : {}),
        },
        onGlobalFilterChange: changeSearch,
        onSortingChange: changeSorting,
        onRowSelectionChange: changeRowSelection,
        enableRowSelection: props.enableRowSelection ? row => props.isRowSelectable?.(row.original) ?? true : false,
        ...(serverPaginated ? {onPaginationChange: changePagination} : {}),
        manualPagination: serverPaginated,
        manualFiltering: serverPaginated || onSearchChange !== undefined,
        manualSorting: serverPaginated || onSortingChange !== undefined,
        enableSorting: !serverPaginated || onSortingChange !== undefined,
        rowCount: pagination?.total,
        autoResetPageIndex: !serverPaginated,
    });

    /** Opens the consuming feature's row action without intercepting nested controls. */
    function getRowInteractionProps(row: T) {
        if (!props.onRowClick || props.isLoading) return {};
        return {
            tabIndex: 0,
            onClick: (event: MouseEvent<HTMLTableRowElement>) => {
                if (!isPortalTableControl(event.target, event.currentTarget)) props.onRowClick?.(row);
            },
            onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
                if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
                event.preventDefault();
                props.onRowClick?.(row);
            },
        };
    }

    return {table, canSearch: !serverPaginated || onSearchChange !== undefined, getRowInteractionProps};
}
