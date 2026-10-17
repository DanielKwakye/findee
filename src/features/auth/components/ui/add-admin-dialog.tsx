"use client";

import type { Ref } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/core/ui/dialog";
import { Button } from "@/components/core/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/core/ui/field";
import { Input } from "@/components/core/ui/input";
import TypographyBody from "@/components/core/ui/typography-body";
import { useAddAdminDialog } from "@/features/auth/components/hooks/use.add.admin.dialog";
import type { AddAdminDialogHandle } from "@/features/auth/utils/auth.types";

/** Presents the form for creating an administrator account. */
export default function AddAdminDialog({ ref }: { ref: Ref<AddAdminDialogHandle> }) {
    const { t, open, changeOpen, form, inputs, mutation, submit } = useAddAdminDialog(ref);
    const { errors } = form.formState;
    return (
        <Dialog open={open} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle><TypographyBody className="font-medium">{t("title")}</TypographyBody></DialogTitle>
                    <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{t("description")}</TypographyBody></DialogDescription>
                </DialogHeader>
                <form noValidate onSubmit={submit} aria-busy={mutation.isPending} className="space-y-6">
                    <fieldset disabled={mutation.isPending} className="min-w-0 space-y-4">
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel htmlFor="admin-name"><TypographyBody className="text-sm">{t("name")}</TypographyBody></FieldLabel>
                            <Input id="admin-name" autoComplete="name" {...inputs.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? "admin-name-error" : undefined} />
                            {errors.name && <FieldError id="admin-name-error"><TypographyBody className="text-sm">{errors.name.message}</TypographyBody></FieldError>}
                        </Field>
                        <Field data-invalid={!!errors.email}>
                            <FieldLabel htmlFor="admin-email"><TypographyBody className="text-sm">{t("email")}</TypographyBody></FieldLabel>
                            <Input id="admin-email" type="email" autoComplete="off" {...inputs.email} aria-invalid={!!errors.email} aria-describedby={errors.email ? "admin-email-error" : undefined} />
                            {errors.email && <FieldError id="admin-email-error"><TypographyBody className="text-sm">{errors.email.message}</TypographyBody></FieldError>}
                        </Field>
                    </fieldset>
                    {(mutation.isError || errors.root) && <div role="alert"><TypographyBody className="text-sm text-destructive">{errors.root?.message ?? t("error")}</TypographyBody></div>}
                    <DialogFooter>
                        <Button type="button" variant="secondary" disabled={mutation.isPending} onClick={() => changeOpen(false)}><TypographyBody className="text-sm">{t("cancel")}</TypographyBody></Button>
                        <Button type="submit" disabled={mutation.isPending}><TypographyBody className="text-sm">{t(mutation.isPending ? "saving" : "save")}</TypographyBody></Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
