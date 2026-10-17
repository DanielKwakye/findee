"use client";

import {PortalConfirmDialog, PortalTable} from "@/components/platform";
import {Button} from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import {useProductsTable} from "@/features/products/components/hooks/use.products.table";
import ProductVariantFilter from "@/features/products/components/ui/product-variant-filter";
import {Alert, AlertDescription, AlertTitle} from "@/components/core/ui/alert";
import {Info} from "lucide-react";

/** Presents product records and their allowed inventory actions. */
export default function ProductsTable() {
    const {t, stockT, stockQuery, variants, query, mutation, columns, search, setSearch, setSorting, pagination, setPagination, confirmRef, variant, changeVariant} = useProductsTable();
    return (
        <div className="min-w-0 space-y-4">
            {!!stockQuery.data?.length && <Alert className="border-warning/20 bg-warning/10">
                <Info aria-hidden="true" className="text-warning" />
                <AlertTitle><TypographyBody className="text-sm font-medium">{stockT("title")}</TypographyBody></AlertTitle>
                <AlertDescription className="text-foreground">
                    <TypographyBody className="text-sm">{stockT("summary")}</TypographyBody>
                    <ul className="list-disc space-y-1 pl-4">
                        {stockQuery.data.map(item => <li key={item.variant}>
                            <TypographyBody className="text-sm">{stockT("variant", {...item, variant: variants(item.variant)})}</TypographyBody>
                        </li>)}
                    </ul>
                </AlertDescription>
            </Alert>}
            {stockQuery.isError && <Alert className="border-warning/20 bg-warning/10">
                <Info aria-hidden="true" className="text-warning" />
                <AlertDescription className="text-foreground">
                    <TypographyBody className="text-sm">{stockT("loadError")}</TypographyBody>
                    <Button type="button" variant="outline" disabled={stockQuery.isFetching} onClick={() => stockQuery.refetch()}>
                        <TypographyBody className="text-sm">{t("retry")}</TypographyBody>
                    </Button>
                </AlertDescription>
            </Alert>}
            {query.isError && (
                <div role="alert" className="flex flex-wrap items-center gap-2">
                    <TypographyBody className="text-sm text-destructive">{t("loadError")}</TypographyBody>
                    <Button type="button" variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}>
                        <TypographyBody className="text-sm">{t("retry")}</TypographyBody>
                    </Button>
                </div>
            )}
            {mutation.isError && <div role="alert"><TypographyBody className="text-sm text-destructive">{mutation.error.message || t("deleteError")}</TypographyBody></div>}
            <PortalTable data={query.data?.products ?? []} columns={columns} pagination={pagination} onPaginationChange={setPagination}
                search={search} onSearchChange={setSearch} onSortingChange={setSorting}
                isLoading={query.isLoading}
                toolbarActions={(
                    <>
                        <ProductVariantFilter value={variant} onChange={changeVariant} disabled={query.isFetching || mutation.isPending} />
                    </>
                )} />
            <PortalConfirmDialog ref={confirmRef} />
        </div>
    );
}
