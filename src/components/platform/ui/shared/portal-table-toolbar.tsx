import {ChevronDown} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/core/ui/button";
import {Input} from "@/components/core/ui/input";
import TypographyBody from "@/components/core/ui/typography-body";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuCheckboxItem,
} from "@/components/core/ui/dropdown-menu";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/core/ui/select";
import {getPortalTablePageSizes} from "@/components/platform/utils/portal.table.utils";
import type {PortalTableToolbarProps} from "@/components/platform/utils/portal.table.types";

/** Renders reusable search, page-size, column visibility, and custom table controls. */
export default function PortalTableToolbar<T extends object>({
    table, isLoading = false, showSearch = true, showColumnSelectionButton = true,
    showPageSizeSelector = true, toolbarActions,
}: PortalTableToolbarProps<T>) {
    const t = useTranslations("portalTable");
    const pageSize = table.state.pagination.pageSize;
    const pageSizes = getPortalTablePageSizes(pageSize);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            {/* Global search */}
            {showSearch && (
                <Input className="w-full sm:max-w-sm" value={table.state.globalFilter ?? ""}
                    placeholder={t("search")} aria-label={t("search")} disabled={isLoading}
                    onChange={event => table.setGlobalFilter(event.currentTarget.value)} />
            )}
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                {/* Page Size Selector */}
                {showPageSizeSelector && (
                    <div className="flex items-center gap-2">
                        <TypographyBody className="text-sm text-muted-foreground">{t("rowsPerPage")}</TypographyBody>
                        <Select value={String(pageSize)} disabled={isLoading} onValueChange={value => {
                            if (value) table.setPageSize(Number(value));
                        }}>
                            <SelectTrigger aria-label={t("rowsPerPage")}><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {pageSizes.map(size => (
                                    <SelectItem key={size} value={String(size)}>
                                        <TypographyBody className="text-sm">{size}</TypographyBody>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {/* Column visibility */}
                {showColumnSelectionButton && (
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<Button type="button" variant="outline" disabled={isLoading} />}>
                            <TypographyBody className="text-sm">{t("columns")}</TypographyBody>
                            <ChevronDown aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                {table.getAllLeafColumns().filter(column => column.getCanHide()).map((column, index) => (
                                    <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()}
                                        disabled={column.getIsVisible() && table.getVisibleLeafColumns().length === 1}
                                        onCheckedChange={checked => column.toggleVisibility(checked)}>
                                        <TypographyBody className="text-sm">
                                            {column.columnDef.meta?.label ?? (typeof column.columnDef.header === "string" ? column.columnDef.header : t("column", {number: index + 1}))}
                                        </TypographyBody>
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                {toolbarActions}
                {table.options.enableRowSelection && Object.keys(table.state.rowSelection).length > 0 && (
                    <>
                        <TypographyBody className="text-sm text-muted-foreground">
                            {t("selectedCount", {count: Object.keys(table.state.rowSelection).length})}
                        </TypographyBody>
                        <Button type="button" variant="ghost" disabled={isLoading} onClick={() => table.resetRowSelection(true)}>
                            <TypographyBody className="text-sm">{t("clearSelection")}</TypographyBody>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
