"use client";

import type { Ref } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/core/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/core/ui/table";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH3 from "@/components/core/ui/typography-h3";
import { useOrderDetailsDialog } from "@/features/orders/components/hooks/use.order.details.dialog";
import type { OrderDetailsDialogHandle } from "@/features/orders/utils/order.types";

/** Presents all order details in an internally managed two-column dialog. */
export default function OrderDetailsDialog({ ref }: { ref: Ref<OrderDetailsDialogHandle> }) {
    const { t, open, changeOpen, query, groups } = useOrderDetailsDialog(ref);
    return (
        <Dialog open={open} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl" aria-busy={query.isFetching}>
                <DialogHeader className="pr-8">
                    <DialogTitle><TypographyBody className="font-medium">{t("details.title")}</TypographyBody></DialogTitle>
                    <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{t("details.description")}</TypographyBody></DialogDescription>
                </DialogHeader>
                <DialogClose render={<Button type="button" variant="ghost" size="icon-sm" className="absolute top-4 right-4" aria-label={t("details.close")} />}><XIcon aria-hidden="true" /></DialogClose>
                {query.isFetching ? <div role="status"><TypographyBody className="text-sm text-muted-foreground">{t("details.loading")}</TypographyBody></div>
                    : query.isError ? <div role="alert" className="space-y-3">
                        <TypographyBody className="text-sm text-destructive">{t("details.loadError")}</TypographyBody>
                        <Button type="button" variant="outline" onClick={() => query.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
                    </div> : <div className="space-y-6">{groups.map(group => <section key={group.id} aria-label={group.heading} className="space-y-2">
                        <TypographyH3 className="text-base font-semibold tracking-normal">{group.heading}</TypographyH3>
                        <Table><TableBody>{group.rows.map(row => <TableRow key={row.id}>
                        <TableHead scope="row" className="h-auto w-2/5 align-top whitespace-normal py-3"><TypographyBody className="text-sm font-medium">{row.label}</TypographyBody></TableHead>
                        <TableCell className="align-top whitespace-pre-wrap break-all"><TypographyBody className="text-sm">{row.value}</TypographyBody></TableCell>
                    </TableRow>)}</TableBody></Table>
                    </section>)}</div>}
            </DialogContent>
        </Dialog>
    );
}
