"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { login } from "@/features/auth/utils/auth.client";
import type { LoginValues } from "@/features/auth/utils/auth.types";

/** Manages sign-in form validation, submission, and authenticated navigation. */
export function useLogin() {
    const t = useTranslations("Auth");
    const router = useRouter();
    const form = useForm<LoginValues>({ defaultValues: { email: "", password: "" } });
    const mutation = useMutation({
        mutationFn: login,
        retry: false,
        /** Opens the admin entry point after successful authentication. */
        onSuccess(url) { router.replace(url);router.refresh(); },
    });
    const errorKey = mutation.error?.message;
    const error = mutation.isError ? t(errorKey === "rateLimited" || errorKey === "invalidCredentials" ? errorKey : "serverError") : null;
    return { form, mutation, error, t };
}
