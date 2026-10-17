"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { changeAdminPassword } from "@/features/auth/server/change.admin.password.action";
import type { ChangeAdminPasswordValues } from "@/features/auth/utils/auth.types";
import { useLogout } from "@/features/auth/components/hooks/use.logout";

/** Manages the mandatory administrator password change and portal refresh. */
export function useChangeAdminPassword() {
    const t = useTranslations("AdminPasswordChange");
    const tAuth = useTranslations("Auth");
    const logout = useLogout();
    const router = useRouter();
    const queryClient = useQueryClient();
    /** Presents the required password form. */
    const form = useForm<ChangeAdminPasswordValues>({ defaultValues: { password: "", confirmPassword: "" } });
    const mutation = useMutation({
        mutationFn: changeAdminPassword,
        retry: false,
        /** Refreshes portal permissions after the password has been replaced. */
        onSuccess(result) {
            if (result.error) {
                form.setError("password", { message: t(result.error) });
                return;
            }
            form.reset();
            queryClient.clear();
            router.replace("/admin");
            router.refresh();
        },
    });
    const inputs = {
        password: form.register("password", {
            required: t("invalid"), minLength: { value: 8, message: t("invalid") }, maxLength: { value: 1024, message: t("invalid") },
        }),
        confirmPassword: form.register("confirmPassword", {
            validate: value => (!!value && value === form.getValues("password")) || t("mismatch"),
        }),
    };
    /** Submits the validated replacement credentials. */
    const submit = form.handleSubmit(values => {
        if (!logout.isPending && !mutation.isPending && !(mutation.isSuccess && !mutation.data.error)) mutation.mutate(values);
    });
    return { t, tAuth, form, inputs, mutation, submit, logout };
}
