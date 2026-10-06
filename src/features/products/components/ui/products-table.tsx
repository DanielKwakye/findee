"use client";

import {PortalConfirmDialog, PortalTable} from "@/components/platform";
import {Button} from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import {useProductsTable} from "@/features/products/components/hooks/use.products.table";
import ProductVariantFilter from "@/features/products/components/ui/product-variant-filter";

/** Presents product records and their allowed inventory actions. */
export default function ProductsTable() {
    const {t, query, mutation, columns, search, setSearch, setSorting, pagination, setPagination, confirmRef, requestDelete, rowSelection, setRowSelection, selectedCount, variant, changeVariant} = useProductsTable();
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
            {mutation.isError && <div role="alert"><TypographyBody className="text-sm text-destructive">{t("deleteError")}</TypographyBody></div>}
            <PortalTable data={query.data?.products ?? []} columns={columns} pagination={pagination} onPaginationChange={setPagination}
                search={search} onSearchChange={setSearch} onSortingChange={setSorting}
                enableRowSelection getRowId={row => row.code} isRowSelectable={row => !row.published}
                rowSelection={rowSelection} onRowSelectionChange={setRowSelection}
                isLoading={query.isFetching || mutation.isPending}
                toolbarActions={(
                    <>
                        <ProductVariantFilter value={variant} onChange={changeVariant} disabled={query.isFetching || mutation.isPending} />
                        {selectedCount > 0 && (
                            <Button type="button" variant="destructive" disabled={query.isFetching || mutation.isPending} onClick={requestDelete}>
                                <TypographyBody className="text-sm">{t("deleteSelected")}</TypographyBody>
                            </Button>
                        )}
                    </>
                )} />
            <PortalConfirmDialog ref={confirmRef} />
        </div>
    );
}
