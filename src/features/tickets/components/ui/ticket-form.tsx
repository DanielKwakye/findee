"use client";

import Link from "next/link";
import { Button } from "@/components/core/ui/button";
import { Card, CardHeader, CardContent } from "@/components/core/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/core/ui/field";
import { Input } from "@/components/core/ui/input";
import { Textarea } from "@/components/core/ui/textarea";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useTicketForm } from "@/features/tickets/components/hooks/use.ticket.form";
import type { TicketValues } from "@/features/tickets/utils/ticket.types";
import { cn } from "@/lib/utils";

/** Presents the customer's support request form and ticket confirmation. */
export default function TicketForm({ initialValues, showTrackingLink = false, readOnly = false, centered = false, showHeader = true, showBorder = true, className }: { initialValues: TicketValues; showTrackingLink?: boolean; readOnly?: boolean; centered?: boolean; showHeader?: boolean; showBorder?: boolean; className?: string }) {
    const { t, form, fields, mutation, submit } = useTicketForm(initialValues, readOnly);
    const { errors } = form.formState;

    return (
        <Card className={cn(readOnly ? "w-full gap-0 overflow-visible rounded-none bg-transparent py-0 ring-0" : "w-full ring-0", !readOnly && showBorder && "border border-border", className)}>
            {!readOnly && showHeader && <CardHeader className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <TypographyH1 className="text-2xl tracking-tight">{t("title")}</TypographyH1>
                    <TypographyParagraph className="text-sm text-muted-foreground">{t("description")}</TypographyParagraph>
                </div>
            </CardHeader>}
            <CardContent className={readOnly ? "px-0" : undefined}>
                <form onSubmit={submit} noValidate aria-busy={mutation.isPending} className={cn("w-full max-w-xl space-y-6", centered && "mx-auto")}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel htmlFor="ticket-name"><TypographyBody className="text-sm">{t("name")}</TypographyBody></FieldLabel>
                            <Input id="ticket-name" autoComplete="name" readOnly={readOnly} disabled={mutation.isPending} {...fields.name}
                                aria-invalid={!!errors.name} aria-describedby={errors.name ? "ticket-name-error" : undefined} />
                            {errors.name && <FieldError id="ticket-name-error"><TypographyBody className="text-sm">{errors.name.message}</TypographyBody></FieldError>}
                        </Field>
                        <Field data-invalid={!!errors.email}>
                            <FieldLabel htmlFor="ticket-email"><TypographyBody className="text-sm">{t("email")}</TypographyBody></FieldLabel>
                            <Input id="ticket-email" type="email" autoComplete="email" readOnly={readOnly} disabled={mutation.isPending} {...fields.email}
                                aria-invalid={!!errors.email} aria-describedby={errors.email ? "ticket-email-error" : undefined} />
                            {errors.email && <FieldError id="ticket-email-error"><TypographyBody className="text-sm">{errors.email.message}</TypographyBody></FieldError>}
                        </Field>
                        <Field data-invalid={!!errors.message}>
                            <FieldLabel htmlFor="ticket-message"><TypographyBody className="text-sm">{t("message")}</TypographyBody></FieldLabel>
                            <Textarea id="ticket-message" rows={5} className="field-sizing-fixed" readOnly={readOnly} disabled={mutation.isPending} {...fields.message}
                                aria-invalid={!!errors.message} aria-describedby={errors.message ? "ticket-message-error" : undefined} />
                            {errors.message && <FieldError id="ticket-message-error"><TypographyBody className="text-sm">{errors.message.message}</TypographyBody></FieldError>}
                        </Field>
                    </FieldGroup>
                    {mutation.isError && <div role="alert"><TypographyParagraph className="text-sm text-destructive">{t("submitError")}</TypographyParagraph></div>}
                    {mutation.isSuccess && <div role="status" className="rounded-xl border border-border bg-muted p-4">
                        <TypographyParagraph className="text-sm">{showTrackingLink
                            ? t.rich("successTracking", { code: mutation.data.code,
                                tickets: chunks => <Link href="/customer/your-tickets" className="font-medium text-primary underline underline-offset-4">{chunks}</Link> })
                            : t("success", { code: mutation.data.code })}</TypographyParagraph>
                        {!mutation.data.notified && <TypographyParagraph className="mt-2 text-sm text-muted-foreground">{t("notificationWarning")}</TypographyParagraph>}
                    </div>}
                    {!readOnly && <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto"><TypographyBody className="text-sm">{t(mutation.isPending ? "submitting" : "submit")}</TypographyBody></Button>}
                </form>
            </CardContent>
        </Card>
    );
}
