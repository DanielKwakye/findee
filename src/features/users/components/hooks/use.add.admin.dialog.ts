"use client";

import { useImperativeHandle, useState, type Ref } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { createAdmin } from "@/features/users/server/create.admin.action";
import { isValidEmail } from "@/features/auth/utils/auth.validation";
import type { AddAdminDialogHandle, AddAdminValues } from "@/features/users/utils/users.types";
import { toast } from "@/components/core/ui/toast";

/** Manages the administrator creation form and dialog lifecycle. */
export function useAddAdminDialog(ref: Ref<AddAdminDialogHandle>) {
    const t = useTranslations("PortalTeamSwitcher.addForm");
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const form = useForm<AddAdminValues>({ defaultValues: { name: "", email: "" } });
    const mutation = useMutation({
        mutationFn: createAdmin,
        retry: false,
        /** Reports creation results and clears credentials after a successful save. */
        onSuccess(result) {
            if (result.error) {
                form.setError(result.error === "duplicate" ? "email" : "root", { message: t(result.error) });
                return;
            }
            form.reset();
            setOpen(false);
            toast.add({ title: t("success"), type: "success" });
            void queryClient.invalidateQueries({ queryKey: ["admins"] });
        },
    });
    useImperativeHandle(ref, () => ({
        /** Opens a fresh administrator form. */
        open() {
            if (mutation.isPending) return;
            form.reset();
            mutation.reset();
            setOpen(true);
        },
    }));
    /** Dismisses the dialog and clears credentials when saving is idle. */
    function changeOpen(nextOpen: boolean) {
        if (mutation.isPending) return;
        setOpen(nextOpen);
        if (!nextOpen) form.reset();
    }
    const inputs = {
        name: form.register("name", { maxLength: { value: 100, message: t("nameInvalid") } }),
        email: form.register("email", { validate: value => isValidEmail(value) || t("emailInvalid") }),
    };
    /** Submits validated administrator credentials. */
    const submit = form.handleSubmit(values => {
        if (!mutation.isPending) mutation.mutate(values);
    });
    return { t, open, changeOpen, form, inputs, mutation, submit };
}
