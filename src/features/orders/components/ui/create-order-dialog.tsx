"use client";

import type {Ref} from "react";
import {XIcon} from "lucide-react";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/core/ui/dialog";
import {Button} from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import CreateOrderForm from "@/features/orders/components/ui/create-order-form";
import {useCreateOrderDialog} from "@/features/orders/components/hooks/use.create.order.dialog";
import type {CreateOrderDialogHandle} from "@/features/orders/utils/order.types";

/** Hosts the reusable order entry form in an internally managed dialog. */
export default function CreateOrderDialog({ref}: {ref: Ref<CreateOrderDialogHandle>}) {
    const {t, open, isSaving, changeOpen, onCreated} = useCreateOrderDialog(ref);
    return (
        <Dialog open={open} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl" aria-busy={isSaving}>
                <DialogHeader className="pr-8">
                    <DialogTitle><TypographyBody className="font-medium">{t("createNewOrder")}</TypographyBody></DialogTitle>
                    <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{t("create.description")}</TypographyBody></DialogDescription>
                </DialogHeader>
                <DialogClose render={<Button type="button" variant="ghost" size="icon-sm" className="absolute top-4 right-4" aria-label={t("create.close")} disabled={isSaving} />}><XIcon aria-hidden="true" /></DialogClose>
                {open && <CreateOrderForm onCreated={onCreated} />}
            </DialogContent>
        </Dialog>
    );
}
