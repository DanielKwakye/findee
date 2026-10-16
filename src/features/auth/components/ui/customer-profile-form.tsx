"use client";

import { Button } from "@/components/core/ui/button";
import { Card, CardHeader, CardContent } from "@/components/core/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/core/ui/field";
import { Input } from "@/components/core/ui/input";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useCustomerProfile } from "@/features/auth/components/hooks/use.customer.profile";
import type { CustomerProfileValues } from "@/features/auth/utils/auth.types";

/** Presents the customer's editable name and phone details. */
export function CustomerProfileForm({ initialValues }: { initialValues: CustomerProfileValues }) {
    const { t, form, mutation, submit } = useCustomerProfile(initialValues);
    const { register, formState: { errors, isDirty } } = form;

    return (
        <Card className="w-full border border-border ring-0">
            <CardHeader>
                <TypographyH1 className="text-2xl tracking-tight">{t("title")}</TypographyH1>
                <TypographyParagraph className="text-sm text-muted-foreground">{t("description")}</TypographyParagraph>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} noValidate aria-busy={mutation.isPending} className="w-full max-w-xl space-y-6">
                <FieldGroup>
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="profile-name"><TypographyBody className="text-sm">{t("name")}</TypographyBody></FieldLabel>
                        <Input id="profile-name" autoComplete="name" disabled={mutation.isPending}
                            aria-invalid={!!errors.name} aria-describedby={errors.name ? "profile-name-error" : undefined}
                            {...register("name", { maxLength: { value: 100, message: t("nameTooLong") } })} />
                        {errors.name && <FieldError id="profile-name-error"><TypographyBody className="text-sm">{errors.name.message}</TypographyBody></FieldError>}
                    </Field>
                    <Field data-invalid={!!errors.phone}>
                        <FieldLabel htmlFor="profile-phone"><TypographyBody className="text-sm">{t("phone")}</TypographyBody></FieldLabel>
                        <Input id="profile-phone" type="tel" autoComplete="tel" disabled={mutation.isPending}
                            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "profile-phone-error" : undefined}
                            {...register("phone", { maxLength: { value: 50, message: t("phoneTooLong") } })} />
                        {errors.phone && <FieldError id="profile-phone-error"><TypographyBody className="text-sm">{errors.phone.message}</TypographyBody></FieldError>}
                    </Field>
                </FieldGroup>
                {mutation.isError && <div role="alert"><TypographyParagraph className="text-sm text-destructive">{t("saveError")}</TypographyParagraph></div>}
                <Button type="submit" disabled={mutation.isPending || !isDirty} className="w-full sm:w-auto">
                    <TypographyBody className="text-sm">{t(mutation.isPending ? "saving" : "save")}</TypographyBody>
                </Button>
                </form>
            </CardContent>
        </Card>
    );
}
