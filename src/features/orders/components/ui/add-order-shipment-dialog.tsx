"use client";

import type { Ref } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/core/ui/dialog";
import { Button } from "@/components/core/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/core/ui/field";
import { Input } from "@/components/core/ui/input";
import TypographyBody from "@/components/core/ui/typography-body";
import { orderShipmentFormFields } from "@/features/orders/data/order.shipment.fields";
import { useAddOrderShipmentDialog } from "@/features/orders/components/hooks/use.add.order.shipment.dialog";
import type { AddOrderShipmentDialogHandle } from "@/features/orders/utils/order.types";

/** Presents the administrator's form for adding an order shipment. */
export default function AddOrderShipmentDialog({ ref }: { ref: Ref<AddOrderShipmentDialogHandle> }) {
    const { t, order, form, mutation, inputs, changeOpen, submit, isUpdating } = useAddOrderShipmentDialog(ref);
    const { errors } = form.formState;
    return (
        <Dialog open={!!order} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
                <DialogHeader className="pr-8">
                    <DialogTitle><TypographyBody className="font-medium">{t(isUpdating ? "updateTitle" : "title")}</TypographyBody></DialogTitle>
                    <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{t("description", { number: order?.number ?? "" })}</TypographyBody></DialogDescription>
                </DialogHeader>
                <DialogClose render={<Button type="button" variant="ghost" size="icon-sm" className="absolute top-4 right-4" aria-label={t("close")} disabled={mutation.isPending} />}><XIcon aria-hidden="true" /></DialogClose>
                <form noValidate onSubmit={submit} aria-busy={mutation.isPending} className="space-y-6">
                    <fieldset disabled={mutation.isPending} className="min-w-0 space-y-4">
                        {orderShipmentFormFields.map(field => <Field key={field.name} data-invalid={!!errors[field.name]}>
                            <FieldLabel htmlFor={`shipment-${field.name}`}><TypographyBody className="text-sm">{t(field.name)}</TypographyBody></FieldLabel>
                            <Input id={`shipment-${field.name}`} type={field.type} {...inputs[field.name]} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `shipment-${field.name}-error` : undefined} />
                            {errors[field.name] && <FieldError id={`shipment-${field.name}-error`}><TypographyBody className="text-sm">{errors[field.name]?.message}</TypographyBody></FieldError>}
                        </Field>)}
                    </fieldset>
                    {mutation.isError && <div role="alert"><TypographyBody className="text-sm text-destructive">{t(isUpdating ? "updateError" : "saveError")}</TypographyBody></div>}
                    <DialogFooter>
                        <Button type="button" variant="secondary" disabled={mutation.isPending} onClick={() => changeOpen(false)}><TypographyBody className="text-sm">{t("cancel")}</TypographyBody></Button>
                        <Button type="submit" disabled={mutation.isPending}><TypographyBody className="text-sm">{t(mutation.isPending ? "saving" : isUpdating ? "updateSave" : "save")}</TypographyBody></Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
