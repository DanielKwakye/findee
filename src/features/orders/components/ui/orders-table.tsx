"use client";

import { PortalTable } from "@/components/platform";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import { useOrdersTable } from "@/features/orders/components/hooks/use.orders.table";
import type { OrderStatusFilter } from "@/features/orders/utils/order.types";
import OrderStatusSelector from "@/features/orders/components/ui/order-status-filter";
import OrderDetailsDialog from "@/features/orders/components/ui/order-details-dialog";
import OrderStatusDialog from "@/features/orders/components/ui/order-status-dialog";
import OrderShipmentsDialog from "@/features/orders/components/ui/order-shipments-dialog";
import AddOrderShipmentDialog from "@/features/orders/components/ui/add-order-shipment-dialog";
import EditOrderDialog from "@/features/orders/components/ui/edit-order-dialog";

/** Presents order records using the shared server-paginated table. */
export default function OrdersTable({ status }: { status: OrderStatusFilter }) {
    const { t, query, columns, search, setSearch, setSorting, pagination, setPagination, changeStatus, detailsRef, editRef, statusRef, shipmentsRef, addShipmentRef, openOrder } = useOrdersTable(status);
    return (
        <div className="min-w-0 space-y-4">
            {query.isError && <div role="alert" className="flex flex-wrap items-center gap-2">
                <TypographyBody className="text-sm text-destructive">{t("loadError")}</TypographyBody>
                <Button type="button" variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}>
                    <TypographyBody className="text-sm">{t("retry")}</TypographyBody>
                </Button>
            </div>}
            <PortalTable data={query.data?.orders ?? []} columns={columns} pagination={pagination} onPaginationChange={setPagination}
                search={search} onSearchChange={setSearch} onSortingChange={setSorting} isLoading={query.isFetching} onRowClick={openOrder}
                toolbarActions={<OrderStatusSelector value={status} onChange={changeStatus} disabled={query.isFetching} />} />
            <OrderDetailsDialog ref={detailsRef} />
            <EditOrderDialog ref={editRef} />
            <OrderStatusDialog ref={statusRef} />
            <OrderShipmentsDialog ref={shipmentsRef} />
            <AddOrderShipmentDialog ref={addShipmentRef} />
        </div>
    );
}
