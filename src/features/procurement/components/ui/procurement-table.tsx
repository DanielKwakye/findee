"use client";

import {PortalConfirmDialog, PortalTable} from "@/components/platform";
import {Button} from "@/components/core/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/core/ui/select";
import {Controller} from "react-hook-form";
import {procurementStatuses} from "@/features/procurement/utils/procurement.types";
import type {ProcurementStatus} from "@/generated/client";
import TypographyBody from "@/components/core/ui/typography-body";
import {useProcurementTable} from "@/features/procurement/components/hooks/use.procurement.table";
import ProductVariantFilter from "@/features/products/components/ui/product-variant-filter";

/** Presents product procurement inventory and its multi-selection controls. */
export default function ProcurementTable() {
    const {t, query, mutation, columns, rowSelection, setRowSelection, selectedCount, pagination, setPagination, search, setSearch, setSorting, downloadSelected, updateSelected, confirmRef, variant, changeVariant, statusForm, updateSelectedStatus, downloadMutation} = useProcurementTable();
    return (
        <div className="min-w-0 space-y-4">
            {query.isError && (
                <div role="alert" className="flex flex-wrap items-center gap-2">
                    <TypographyBody className="text-sm text-destructive">{t("loadError")}</TypographyBody>
                    <Button type="button" variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}>
                        <TypographyBody className="text-sm">{t("retry")}</TypographyBody>
                    </Button>
                </div>
            )}
            {mutation.isError && (
                <div role="alert">
                    <TypographyBody className="text-sm text-destructive">{t("actionError")}</TypographyBody>
                </div>
            )}
            {downloadMutation.isError && (
                <div role="alert">
                    <TypographyBody className="text-sm text-destructive">{t("downloadError")}</TypographyBody>
                </div>
            )}
            <PortalTable data={query.data?.products ?? []} columns={columns}
                pagination={pagination} onPaginationChange={setPagination}
                search={search} onSearchChange={setSearch} onSortingChange={setSorting}
                isLoading={query.isFetching || mutation.isPending} enableRowSelection getRowId={row => row.code}
                rowSelection={rowSelection} onRowSelectionChange={setRowSelection}
                toolbarActions={(
                    <>
                        <ProductVariantFilter value={variant} onChange={changeVariant} disabled={query.isFetching || mutation.isPending} />
                        {selectedCount > 0 && <>
                        <form className="flex flex-wrap items-center gap-2" onSubmit={statusForm.handleSubmit(updateSelectedStatus)}>
                            <Controller name="status" control={statusForm.control} render={({field}) => (
                                <Select<ProcurementStatus> value={field.value} onValueChange={value => {if (value) field.onChange(value);}} disabled={query.isFetching || mutation.isPending}>
                                    <SelectTrigger ref={field.ref} onBlur={field.onBlur} aria-label={t("procurementStatus")}>
                                        <SelectValue><TypographyBody className="text-sm">{t(field.value)}</TypographyBody></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {procurementStatuses.map(status => <SelectItem key={status} value={status}><TypographyBody className="text-sm">{t(status)}</TypographyBody></SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )} />
                            <Button type="submit" variant="default" className="bg-primary/10 text-primary hover:bg-primary/20" disabled={query.isFetching || mutation.isPending}>
                                <TypographyBody className="text-sm">{t("updateStatus")}</TypographyBody>
                            </Button>
                        </form>
                        <Button type="button" variant="outline" disabled={query.isFetching || mutation.isPending || downloadMutation.isPending} onClick={downloadSelected}>
                            <TypographyBody className="text-sm">{t("downloadSelected")}</TypographyBody>
                        </Button>
                        <Button type="button" variant="outline" disabled={query.isFetching || mutation.isPending} onClick={() => updateSelected("publish")}>
                            <TypographyBody className="text-sm">{t("publishSelected")}</TypographyBody>
                        </Button>
                        <Button type="button" variant="outline" disabled={query.isFetching || mutation.isPending} onClick={() => updateSelected("unpublish")}>
                            <TypographyBody className="text-sm">{t("unpublishSelected")}</TypographyBody>
                        </Button>
                        <Button type="button" variant="destructive" disabled={query.isFetching || mutation.isPending} onClick={() => updateSelected("delete")}>
                            <TypographyBody className="text-sm">{t("deleteSelected")}</TypographyBody>
                        </Button>
                        </>}
                    </>
                )} />
            <PortalConfirmDialog ref={confirmRef} />
        </div>
    );
}
