"use client";

import type { Ref } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/core/ui/dialog";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import UpdateOrderForm from "@/features/orders/components/ui/update-order-form";
import { useEditOrderDialog } from "@/features/orders/components/hooks/use.edit.order.dialog";
import type { EditOrderDialogHandle } from "@/features/orders/utils/order.types";

/** Hosts the prefilled order form in an internally managed editing dialog. */
export default function EditOrderDialog({ ref }: { ref: Ref<EditOrderDialogHandle> }) {
    const { t, id, isSaving, query, changeOpen, onSaved } = useEditOrderDialog(ref);
    return <Dialog open={!!id} onOpenChange={changeOpen}>
        <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl" aria-busy={query.isFetching || isSaving}>
            <DialogHeader className="pr-8">
                <DialogTitle><TypographyBody className="font-medium">{t("edit.title")}</TypographyBody></DialogTitle>
                <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{t("edit.description")}</TypographyBody></DialogDescription>
            </DialogHeader>
            <DialogClose render={<Button type="button" variant="ghost" size="icon-sm" className="absolute top-4 right-4" aria-label={t("edit.close")} disabled={isSaving} />}><XIcon aria-hidden="true" /></DialogClose>
            {query.isPending ? <TypographyBody>{t("details.loading")}</TypographyBody>
                : query.isError ? <div role="alert" className="space-y-2">
                    <TypographyBody className="text-sm text-destructive">{t("details.loadError")}</TypographyBody>
                    <Button type="button" variant="outline" onClick={() => query.refetch()}><TypographyBody>{t("retry")}</TypographyBody></Button>
                </div> : id && <UpdateOrderForm key={id} id={id} order={query.data} onUpdated={onSaved} />}
        </DialogContent>
    </Dialog>;
}
