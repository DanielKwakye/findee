"use client";

import {ArrowDown, ArrowUp, ArrowUpDown} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import {Table, TableHeader, TableBody, TableRow, TableHead, TableCell} from "@/components/core/ui/table";
import {usePortalTable} from "@/components/platform/hooks/use.portal.table";
import PortalTableToolbar from "@/components/platform/ui/shared/portal-table-toolbar";
import PortalTablePagination from "@/components/platform/ui/shared/portal-table-pagination";
import type {PortalTableProps} from "@/components/platform/utils/portal.table.types";
import {cn} from "@/lib/utils";

/** Renders a reusable table so feature views only supply data and column definitions. */
export default function PortalTable<T extends object>(props: PortalTableProps<T>) {
    const t = useTranslations("portalTable");
    const {table, canSearch, getRowInteractionProps} = usePortalTable(props);
    const rows = table.getRowModel().rows;
    return (
        <div className={cn("min-w-0 w-full space-y-4", props.className)} aria-busy={props.isLoading ?? false}>
            <PortalTableToolbar table={table} isLoading={props.isLoading}
                showSearch={(props.showSearch ?? true) && canSearch}
                showColumnSelectionButton={props.showColumnSelectionButton}
                showPageSizeSelector={props.showPageSizeSelector} toolbarActions={props.toolbarActions} />
            {/* Table */}
            <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(group => (
                            <TableRow key={group.id}>
                                {group.headers.map(header => {
                                    const sorted = header.column.getIsSorted();
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan} className="text-center"
                                            aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}>
                                            {header.isPlaceholder ? null : typeof header.column.columnDef.header === "string" && header.column.getCanSort() ? (
                                                <Button type="button" variant="ghost" disabled={props.isLoading}
                                                    onClick={header.column.getToggleSortingHandler()}>
                                                    <TypographyBody className="text-sm font-medium">{header.column.columnDef.header}</TypographyBody>
                                                    {sorted === "asc" ? <ArrowUp aria-hidden="true" /> : sorted === "desc" ? <ArrowDown aria-hidden="true" /> : <ArrowUpDown aria-hidden="true" />}
                                                </Button>
                                            ) : <TypographyBody className="inline-flex items-center justify-center text-sm font-medium"><table.FlexRender header={header} /></TypographyBody>}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {props.isLoading || rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={Math.max(1, table.getVisibleLeafColumns().length)} className="h-24 text-center">
                                    <TypographyBody className="text-sm text-muted-foreground">{t(props.isLoading ? "loading" : "noResults")}</TypographyBody>
                                </TableCell>
                            </TableRow>
                        ) : rows.map(row => (
                            <TableRow key={row.id} {...getRowInteractionProps(row.original)} data-state={row.getIsSelected() ? "selected" : undefined} className={cn("even:bg-muted/40", props.onRowClick && "cursor-pointer focus-visible:outline-2 focus-visible:outline-ring")}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} className="text-center" data-row-click-ignore={cell.column.id === "actions" || cell.column.id === "portal-selection" ? "" : undefined}>
                                        <TypographyBody className="inline-flex items-center justify-center text-sm"><table.FlexRender cell={cell} /></TypographyBody>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <PortalTablePagination table={table} isLoading={props.isLoading} />
        </div>
    );
}
