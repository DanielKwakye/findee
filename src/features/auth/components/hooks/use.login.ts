"use client";

import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { login } from "@/features/auth/utils/auth.client";
import type { LoginValues } from "@/features/auth/utils/auth.types";

/** Manages sign-in form validation, submission, and authenticated navigation. */
export function useLogin() {
    const t = useTranslations("Auth");
    const [botCheckReset, setBotCheckReset] = useState(0);
    const router = useRouter();
    const form = useForm<LoginValues>({ defaultValues: { email: "", password: "", turnstileToken: "" } });
    const { setValue, clearErrors } = form;
    /** Keeps the form's bot-check token in sync with the widget. */
    const onBotToken = useCallback((token: string) => {
        setValue("turnstileToken", token);
        if (token) clearErrors("turnstileToken");
    }, [setValue, clearErrors]);
    const mutation = useMutation({
        mutationFn: login,
        retry: false,
        /** Opens the admin entry point after successful authentication. */
        onSuccess(url) { router.replace(url);router.refresh(); },
        /** Refreshes the single-use security check without clearing credentials. */
        onSettled() { setValue("turnstileToken", ""); setBotCheckReset(value => value + 1); },
    });
    const errorKey = mutation.error?.message;
    const error = mutation.isError ? t(errorKey === "rateLimited" || errorKey === "invalidCredentials"
        || errorKey === "disposableEmail" || errorKey === "emailCheckUnavailable" || errorKey === "botCheckFailed" ? errorKey : "serverError") : null;
    return { form, mutation, error, t, onBotToken, botCheckReset };
}
