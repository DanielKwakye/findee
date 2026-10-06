"use client";

import type {Ref} from "react";
import {useTranslations} from "next-intl";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/core/ui/dialog";
import {Button} from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import {usePortalConfirmDialog} from "@/components/platform/hooks/use.portal.confirm.dialog";
import type {PortalConfirmDialogHandle} from "@/components/platform/utils/portal.confirm.dialog.types";

/** Presents reusable confirmation feedback with an imperative, internally managed lifecycle. */
export function PortalConfirmDialog({ref}: {ref: Ref<PortalConfirmDialogHandle>}) {
    const t = useTranslations("PortalConfirmDialog");
    const {options, isPending, error, changeOpen, confirm} = usePortalConfirmDialog(ref);
    return (
        <Dialog open={options !== null} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} aria-busy={isPending}>
                <DialogHeader>
                    <DialogTitle><TypographyBody className="font-medium">{options?.title}</TypographyBody></DialogTitle>
                    <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{options?.description}</TypographyBody></DialogDescription>
                </DialogHeader>
                {error && <div role="alert"><TypographyBody className="text-sm text-destructive">{error}</TypographyBody></div>}
                <DialogFooter>
                    <Button type="button" variant="outline" disabled={isPending} onClick={() => changeOpen(false)}>
                        <TypographyBody className="text-sm">{t("cancel")}</TypographyBody>
                    </Button>
                    <Button type="button" variant={options?.destructive ? "destructive" : "default"} disabled={isPending} onClick={confirm}>
                        <TypographyBody className="text-sm">{isPending ? t("pending") : options?.confirmLabel ?? t("confirm")}</TypographyBody>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
