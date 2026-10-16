"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "@/components/core/ui/toast";
import { updateCustomerProfile } from "@/features/auth/server/update.customer.profile.action";
import type { CustomerProfileValues } from "@/features/auth/utils/auth.types";

/** Manages customer profile editing, validation, and save feedback. */
export function useCustomerProfile(initialValues: CustomerProfileValues) {
    const t = useTranslations("Auth.customerProfile");
    const queryClient = useQueryClient();
    const form = useForm<CustomerProfileValues>({ defaultValues: initialValues });
    const mutation = useMutation({
        mutationFn: updateCustomerProfile,
        retry: false,
        /** Applies saved values and refreshes the visible account identity. */
        onSuccess(profile) {
            form.reset(profile);
            toast.add({ title: t("saveSuccess"), type: "success" });
            void queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
        },
    });

    /** Saves validated edits while preventing duplicate submissions. */
    const submit = form.handleSubmit(values => {
        if (mutation.isPending) return;
        mutation.mutate(values);
    });

    return { t, form, mutation, submit };
}
