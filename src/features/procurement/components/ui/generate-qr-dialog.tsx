"use client";

import type {Ref} from "react";
import {XIcon} from "lucide-react";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/core/ui/dialog";
import {Button} from "@/components/core/ui/button";
import {Input} from "@/components/core/ui/input";
import {Field, FieldError, FieldGroup} from "@/components/core/ui/field";
import TypographyBody from "@/components/core/ui/typography-body";
import {useGenerateQrDialog} from "@/features/procurement/components/hooks/use.generate.qr.dialog";
import {isValidQrQuantity, maxQrVariantQuantity, qrVariants} from "@/features/procurement/utils/procurement.generation";
import type {GenerateQrDialogHandle} from "@/features/procurement/utils/procurement.types";

/** Renders the internally managed QR generation form exposed through an imperative ref. */
export default function GenerateQrDialog({ref}: {ref: Ref<GenerateQrDialogHandle>}) {
    const {t, id, open, changeOpen, form, mutation, submit} = useGenerateQrDialog(ref);
    const {register, handleSubmit, formState: {errors}} = form;
    return (
        <Dialog open={open} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
                <DialogHeader className="pr-8">
                    <DialogTitle><TypographyBody className="font-medium">{t("title")}</TypographyBody></DialogTitle>
                    <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{t("description")}</TypographyBody></DialogDescription>
                </DialogHeader>
                <DialogClose render={<Button type="button" variant="ghost" size="icon-sm" className="absolute top-4 right-4" disabled={mutation.isPending} aria-label={t("close")} />}>
                    <XIcon aria-hidden="true" />
                </DialogClose>
                <form noValidate onSubmit={handleSubmit(submit)} aria-busy={mutation.isPending} className="space-y-6">
                    <FieldGroup>
                        {qrVariants.map(variant => (
                            <Field key={variant} data-invalid={!!errors[variant]}>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input disabled value={t(variant)} aria-label={t("variant")} />
                                    <Input id={`${id}-${variant}`} type="number" min={0} max={maxQrVariantQuantity} step={1} disabled={mutation.isPending}
                                        aria-label={t("quantityFor", {variant: t(variant)})} aria-invalid={!!errors[variant]}
                                        aria-describedby={errors[variant] ? `${id}-${variant}-error` : undefined}
                                        {...register(variant, {valueAsNumber: true, validate: value => isValidQrQuantity(value) || t("quantityInvalid")})} />
                                </div>
                                {errors[variant] && <FieldError id={`${id}-${variant}-error`}><TypographyBody className="text-sm">{errors[variant]?.message}</TypographyBody></FieldError>}
                            </Field>
                        ))}
                        {(errors.root || mutation.isError) && (
                            <FieldError role="alert"><TypographyBody className="text-sm">{errors.root?.message ?? t("serverError")}</TypographyBody></FieldError>
                        )}
                    </FieldGroup>
                    <DialogFooter>
                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            <TypographyBody className="text-sm font-medium">{t(mutation.isPending ? "submitting" : "submit")}</TypographyBody>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
