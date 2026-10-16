"use client";

import type { Ref } from "react";
import { Controller } from "react-hook-form";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/core/ui/dialog";
import { Button } from "@/components/core/ui/button";
import { Badge } from "@/components/core/ui/badge";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/core/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/core/ui/select";
import { Textarea } from "@/components/core/ui/textarea";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useTicketDetails } from "@/features/tickets/components/hooks/use.ticket.details";
import { ticketStatuses, ticketStatusBadgeClasses } from "@/features/tickets/data/ticket.statuses";
import type { TicketDialogHandle } from "@/features/tickets/utils/ticket.types";
import type { TicketStatus } from "@/generated/client";

/** Presents ticket information and administrator-only handling controls. */
export default function TicketDetailsDialog({ ref, audience = "admin" }: { ref: Ref<TicketDialogHandle>; audience?: "admin" | "customer" }) {
    const { t, formatDate, id, query, form, mutation, changeOpen, submit } = useTicketDetails(ref, audience);
    const ticket = query.data;
    return (
        <Dialog open={!!id} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl" aria-busy={query.isFetching || mutation.isPending}>
                <DialogHeader className="pr-8">
                    <DialogTitle><TypographyBody className="font-medium">{t("details.title")}</TypographyBody></DialogTitle>
                    <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{audience === "customer" ? t("details.customerDescription", { code: query.data?.code ?? "" }) : t("details.description")}</TypographyBody></DialogDescription>
                </DialogHeader>
                <DialogClose render={<Button type="button" variant="ghost" size="icon-sm" className="absolute top-4 right-4" disabled={mutation.isPending} aria-label={t("details.close")} />}><XIcon aria-hidden="true" /></DialogClose>
                {query.isPending ? <div role="status"><TypographyBody className="text-sm">{t("details.loading")}</TypographyBody></div>
                    : query.isError ? <div role="alert" className="space-y-3">
                        <TypographyParagraph className="text-sm text-destructive">{t("loadError")}</TypographyParagraph>
                        <Button type="button" variant="outline" onClick={() => query.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
                    </div> : ticket && <>
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <div><dt><TypographyBody className="text-sm text-muted-foreground">{t("columns.code")}</TypographyBody></dt><dd><TypographyBody className="text-sm">{ticket.code}</TypographyBody></dd></div>
                            <div><dt><TypographyBody className="text-sm text-muted-foreground">{t("columns.createdAt")}</TypographyBody></dt><dd><TypographyBody className="text-sm">{formatDate(ticket.createdAt)}</TypographyBody></dd></div>
                            <div><dt><TypographyBody className="text-sm text-muted-foreground">{t("columns.customerName")}</TypographyBody></dt><dd><TypographyBody className="text-sm break-words">{ticket.customerName}</TypographyBody></dd></div>
                            <div><dt><TypographyBody className="text-sm text-muted-foreground">{t("columns.customerEmail")}</TypographyBody></dt><dd><TypographyBody className="text-sm break-all">{ticket.customerEmail}</TypographyBody></dd></div>
                            {audience === "customer" && <div><dt><TypographyBody className="text-sm text-muted-foreground">{t("columns.status")}</TypographyBody></dt><dd><Badge variant="secondary" className={ticketStatusBadgeClasses[ticket.status]}><TypographyBody className="text-xs">{t(`statuses.${ticket.status}`)}</TypographyBody></Badge></dd></div>}
                            <div className="sm:col-span-2"><dt><TypographyBody className="text-sm text-muted-foreground">{t("columns.message")}</TypographyBody></dt><dd><TypographyParagraph className="text-sm whitespace-pre-wrap break-words">{ticket.message}</TypographyParagraph></dd></div>
                        </dl>
                        {audience === "admin" && <form onSubmit={submit} noValidate aria-busy={mutation.isPending} className="space-y-6">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="ticket-status"><TypographyBody className="text-sm">{t("columns.status")}</TypographyBody></FieldLabel>
                                    <Controller name="status" control={form.control} render={({ field }) => (
                                        <Select<TicketStatus> value={field.value} onValueChange={value => { if (value) field.onChange(value); }} disabled={mutation.isPending}>
                                            <SelectTrigger id="ticket-status"><SelectValue><TypographyBody className="text-sm">{t(`statuses.${field.value}`)}</TypographyBody></SelectValue></SelectTrigger>
                                            <SelectContent>{ticketStatuses.map(status => <SelectItem key={status} value={status}><TypographyBody className="text-sm">{t(`statuses.${status}`)}</TypographyBody></SelectItem>)}</SelectContent>
                                        </Select>
                                    )} />
                                </Field>
                                <Field data-invalid={!!form.formState.errors.remarks}>
                                    <FieldLabel htmlFor="ticket-remarks"><TypographyBody className="text-sm">{t("details.remarks")}</TypographyBody></FieldLabel>
                                    <Textarea id="ticket-remarks" rows={5} className="field-sizing-fixed" disabled={mutation.isPending} aria-describedby="ticket-remarks-help" aria-invalid={!!form.formState.errors.remarks}
                                        {...form.register("remarks", { maxLength: { value: 5000, message: t("details.remarksTooLong") } })} />
                                    <div id="ticket-remarks-help"><TypographyBody className="text-xs text-muted-foreground">{t("details.remarksHelp")}</TypographyBody></div>
                                    {form.formState.errors.remarks && <FieldError><TypographyBody className="text-sm">{form.formState.errors.remarks.message}</TypographyBody></FieldError>}
                                </Field>
                            </FieldGroup>
                            {mutation.isError && <div role="alert"><TypographyParagraph className="text-sm text-destructive">{t("details.saveError")}</TypographyParagraph></div>}
                            <DialogFooter>
                                <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => changeOpen(false)}><TypographyBody className="text-sm">{t("details.cancel")}</TypographyBody></Button>
                                <Button type="submit" disabled={mutation.isPending || !form.formState.isDirty}><TypographyBody className="text-sm">{t(mutation.isPending ? "details.saving" : "details.save")}</TypographyBody></Button>
                            </DialogFooter>
                        </form>}
                    </>}
            </DialogContent>
        </Dialog>
    );
}
