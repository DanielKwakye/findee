"use client";

import { PortalTable } from "@/components/platform";
import { Button } from "@/components/core/ui/button";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useCustomerOrders } from "@/features/orders/components/hooks/use.customer.orders";
import OrderShipmentsDialog from "@/features/orders/components/ui/order-shipments-dialog";

/** Presents the signed-in customer's purchases and tracking actions. */
export default function CustomerOrdersTable() {
    const { t, query, columns, search, setSearch, setSorting, pagination, setPagination, trackingRef } = useCustomerOrders();
    return (
        <div className="min-w-0 space-y-6 py-4">
            <div className="space-y-2">
                <TypographyH1 className="text-2xl tracking-tight">{t("heading")}</TypographyH1>
                <TypographyParagraph className="text-sm text-muted-foreground">{t("customer.description")}</TypographyParagraph>
            </div>
            {query.isError && <div role="alert" className="flex flex-wrap items-center gap-2">
                <TypographyBody className="text-sm text-destructive">{t("loadError")}</TypographyBody>
                <Button type="button" variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
            </div>}
            <PortalTable data={query.data?.orders ?? []} columns={columns} pagination={pagination} onPaginationChange={setPagination}
                search={search} onSearchChange={setSearch} onSortingChange={setSorting} isLoading={query.isLoading} />
            <OrderShipmentsDialog ref={trackingRef} readOnly />
        </div>
    );
}
