"use client";

import { useForm, useWatch } from "react-hook-form";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { requestCustomerOtp } from "@/features/auth/server/request.customer.otp";
import { verifyCustomerOtp } from "@/features/auth/server/verify.customer.otp.action";
import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";
import type { CustomerOtpValues } from "@/features/auth/utils/auth.types";

/** Manages customer email verification, resending, and form feedback. */
export function useCustomerOtp(onVerified: (email: string) => void) {
    const t = useTranslations("Auth.customerOtp");
    const tBotCheck = useTranslations("Auth.botCheck");
    const [botCheckReset, setBotCheckReset] = useState(0);
    const form = useForm<CustomerOtpValues>({ defaultValues: { email: "", code: "", turnstileToken: "" }, shouldUnregister: true });
    const { setValue, clearErrors } = form;
    /** Keeps the form's bot-check token in sync with the widget. */
    const onBotToken = useCallback((token: string) => {
        setValue("turnstileToken", token);
        if (token) clearErrors("turnstileToken");
    }, [setValue, clearErrors]);
    const email = useWatch({ control: form.control, name: "email" });
    const request = useMutation({ mutationFn: (values: CustomerOtpValues) => requestCustomerOtp(values.email, values.turnstileToken), retry: false,
        /** Prepares code entry after a verification request. */
        onSuccess() { form.setValue("code", ""); form.clearErrors("code"); },
        /** Refreshes the single-use check for the next code request. */
        onSettled() { setValue("turnstileToken", ""); setBotCheckReset(value => value + 1); },
    });
    const verification = useMutation({ mutationFn: verifyCustomerOtp, retry: false,
        /** Reports the authenticated email to the consuming flow. */
        onSuccess(result) { onVerified(result.email); },
    });
    const codeVisible = !!request.data && request.data.email === normalizeEmail(email);
    const busy = request.isPending || verification.isPending;
    const emailInput = form.register("email", {
        required: t("emailRequired"),
        validate: value => isValidEmail(value) || t("emailInvalid"),
        /** Clears request feedback when the email identity changes. */
        onChange() { request.reset(); verification.reset(); form.setValue("code", ""); },
    });
    const failure = verification.error ?? request.error;
    const error = failure ? t(failure.message === "emailInvalid" ? "emailInvalid"
        : failure.message === "disposableEmail" ? "disposableEmail"
        : failure.message === "emailCheckUnavailable" ? "emailCheckUnavailable"
        : failure.message === "botCheckFailed" ? "botCheckFailed"
        : failure.message === "codeInvalid" ? "codeInvalid"
        : failure.message === "verificationFailed" ? "verificationFailed" : "serverError") : null;

    /** Requests a verification code for a validated email address. */
    async function onRequest() {
        if (busy || !await form.trigger("email", { shouldFocus: true })) return;
        if (!form.getValues("turnstileToken")) {
            form.setError("turnstileToken", { message: tBotCheck("required") });
            return;
        }
        verification.reset();
        request.mutate(form.getValues());
    }

    /** Submits the verification form for its current email and code. */
    const onSubmit = form.handleSubmit(values => {
        if (busy) return;
        if (codeVisible) verification.mutate(values);
        else void onRequest();
    });

    return { t, form, emailInput, codeVisible, busy, request, verification, error, onRequest, onSubmit, onBotToken, botCheckReset };
}
