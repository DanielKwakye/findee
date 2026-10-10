"use client";

import type { Ref } from "react";
import { Trash2, XIcon } from "lucide-react";
import { PortalConfirmDialog } from "@/components/platform";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/core/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/core/ui/table";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH3 from "@/components/core/ui/typography-h3";
import { useOrderShipmentsDialog } from "@/features/orders/components/hooks/use.order.shipments.dialog";
import AddOrderShipmentDialog from "@/features/orders/components/ui/add-order-shipment-dialog";
import type { OrderShipmentsDialogHandle } from "@/features/orders/utils/order.types";

/** Presents an order's shipment records and their deletion controls. */
export default function OrderShipmentsDialog({ ref }: { ref: Ref<OrderShipmentsDialogHandle> }) {
    const { t, order, query, mutation, groups, confirmRef, updateRef, changeOpen, requestDelete, requestUpdate } = useOrderShipmentsDialog(ref);
    return (
        <>
            <Dialog open={!!order} onOpenChange={changeOpen}>
                <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl" aria-busy={query.isFetching || mutation.isPending}>
                    <DialogHeader className="pr-8">
                        <DialogTitle><TypographyBody className="font-medium">{t("shipments.view")}</TypographyBody></DialogTitle>
                        <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{t("shipments.description", { number: order?.number ?? "" })}</TypographyBody></DialogDescription>
                    </DialogHeader>
                    <DialogClose render={<Button type="button" variant="ghost" size="icon-sm" className="absolute top-4 right-4" aria-label={t("shipments.close")} disabled={mutation.isPending} />}><XIcon aria-hidden="true" /></DialogClose>
                    {query.isFetching ? <div role="status"><TypographyBody className="text-sm text-muted-foreground">{t("shipments.loading")}</TypographyBody></div>
                        : query.isError ? <div role="alert" className="space-y-3">
                            <TypographyBody className="text-sm text-destructive">{t("shipments.loadError")}</TypographyBody>
                            <Button type="button" variant="outline" onClick={() => query.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
                        </div> : groups.length === 0 ? <TypographyBody className="text-sm text-muted-foreground">{t("shipments.empty")}</TypographyBody>
                            : <div className="space-y-6">{groups.map(group => <section key={group.id} aria-label={group.heading} className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <TypographyH3 className="text-base font-semibold tracking-normal">{group.heading}</TypographyH3>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" size="sm" disabled={mutation.isPending} onClick={() => requestUpdate(group.id)}><TypographyBody className="text-sm">{t("shipments.update")}</TypographyBody></Button>
                                        <Button type="button" variant="destructive" size="icon-sm" disabled={mutation.isPending} aria-label={t("shipments.deleteRecord", { shipment: group.heading })} onClick={() => requestDelete(group.id)}><Trash2 aria-hidden="true" /></Button>
                                    </div>
                                </div>
                                <Table><TableBody>{group.rows.map(row => <TableRow key={row.id}>
                                    <TableHead scope="row" className="h-auto w-2/5 align-top whitespace-normal py-3"><TypographyBody className="text-sm font-medium">{row.label}</TypographyBody></TableHead>
                                    <TableCell className="align-top whitespace-pre-wrap break-all"><TypographyBody className="text-sm">{row.value}</TypographyBody></TableCell>
                                </TableRow>)}</TableBody></Table>
                            </section>)}</div>}
                </DialogContent>
            </Dialog>
            <PortalConfirmDialog ref={confirmRef} />
            <AddOrderShipmentDialog ref={updateRef} />
        </>
    );
}
