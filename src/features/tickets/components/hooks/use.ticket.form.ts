"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { isValidEmail } from "@/features/auth/utils/auth.validation";
import { createTicket } from "@/features/tickets/server/create.ticket.action";
import type { TicketValues } from "@/features/tickets/utils/ticket.types";

/** Manages customer support form validation, submission, and confirmation. */
export function useTicketForm(initialValues: TicketValues, readOnly = false) {
    const t = useTranslations("TicketForm");
    const form = useForm<TicketValues>({ defaultValues: initialValues });
    const queryClient = useQueryClient();
    const mutation = useMutation({ mutationFn: createTicket, retry: false,
        /** Prepares the form for another message after saving the ticket. */
        onSuccess() {
            form.reset({ ...form.getValues(), message: "" });
            void queryClient.invalidateQueries({ queryKey: ["customer-tickets"] });
            void queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
        },
    });
    const fields = {
        name: form.register("name", {
            validate: value => !!value.trim() || t("nameRequired"),
            maxLength: { value: 100, message: t("nameTooLong") },
        }),
        email: form.register("email", {
            required: t("emailRequired"), validate: value => isValidEmail(value) || t("emailInvalid"),
        }),
        message: form.register("message", {
            validate: value => !!value.trim() || t("messageRequired"),
            maxLength: { value: 5000, message: t("messageTooLong") },
        }),
    };

    /** Saves a validated message while preventing concurrent submissions. */
    const submit = form.handleSubmit(values => {
        if (readOnly || mutation.isPending) return;
        mutation.mutate(values);
    });

    return { t, form, fields, mutation, submit };
}
