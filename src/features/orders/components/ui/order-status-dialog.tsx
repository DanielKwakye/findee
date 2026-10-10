"use client";

import type { Ref } from "react";
import { Controller } from "react-hook-form";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/core/ui/dialog";
import { Button } from "@/components/core/ui/button";
import { Field, FieldLabel } from "@/components/core/ui/field";
import TypographyBody from "@/components/core/ui/typography-body";
import OrderStatusFilter from "@/features/orders/components/ui/order-status-filter";
import { useOrderStatusDialog } from "@/features/orders/components/hooks/use.order.status.dialog";
import type { OrderStatusDialogHandle } from "@/features/orders/utils/order.types";

/** Presents the order status form with an imperative, internally managed dialog. */
export default function OrderStatusDialog({ ref }: { ref: Ref<OrderStatusDialogHandle> }) {
    const { t, order, form, mutation, changeOpen, submit } = useOrderStatusDialog(ref);
    return (
        <Dialog open={!!order} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false}>
                <DialogHeader className="pr-8">
                    <DialogTitle><TypographyBody className="font-medium">{t("changeStatus")}</TypographyBody></DialogTitle>
                    <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{t("statusDialog.description", { number: order?.number ?? "" })}</TypographyBody></DialogDescription>
                </DialogHeader>
                <DialogClose render={<Button type="button" variant="ghost" size="icon-sm" className="absolute top-4 right-4" aria-label={t("statusDialog.close")} disabled={mutation.isPending} />}><XIcon aria-hidden="true" /></DialogClose>
                <form noValidate onSubmit={submit} aria-busy={mutation.isPending} className="space-y-6">
                    <Field>
                        <FieldLabel htmlFor="order-status"><TypographyBody className="text-sm">{t("columns.status")}</TypographyBody></FieldLabel>
                        <Controller name="status" control={form.control} render={({ field }) => (
                            <OrderStatusFilter id="order-status" value={field.value} onChange={value => { if (value !== "all") field.onChange(value); }}
                                includeAll={false} disabled={mutation.isPending} />
                        )} />
                    </Field>
                    {mutation.isError && <div role="alert"><TypographyBody className="text-sm text-destructive">{t("statusDialog.saveError")}</TypographyBody></div>}
                    <DialogFooter>
                        <Button type="button" variant="secondary" disabled={mutation.isPending} onClick={() => changeOpen(false)}><TypographyBody className="text-sm">{t("statusDialog.cancel")}</TypographyBody></Button>
                        <Button type="submit" disabled={mutation.isPending || !form.formState.isDirty}><TypographyBody className="text-sm">{t(mutation.isPending ? "statusDialog.saving" : "statusDialog.save")}</TypographyBody></Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
