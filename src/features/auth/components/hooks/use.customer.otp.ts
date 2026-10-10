"use client";

import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { requestCustomerOtp } from "@/features/auth/server/request.customer.otp";
import { verifyCustomerOtp } from "@/features/auth/server/verify.customer.otp.action";
import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";
import type { CustomerOtpValues } from "@/features/auth/utils/auth.types";

/** Manages customer email verification, resending, and form feedback. */
export function useCustomerOtp(onVerified: (email: string) => void) {
    const t = useTranslations("Auth.customerOtp");
    const form = useForm<CustomerOtpValues>({ defaultValues: { email: "", code: "" }, shouldUnregister: true });
    const email = useWatch({ control: form.control, name: "email" });
    const request = useMutation({ mutationFn: requestCustomerOtp, retry: false,
        /** Prepares code entry after a verification request. */
        onSuccess() { form.setValue("code", ""); form.clearErrors("code"); },
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
        : failure.message === "codeInvalid" ? "codeInvalid"
        : failure.message === "verificationFailed" ? "verificationFailed" : "serverError") : null;

    /** Requests a verification code for a validated email address. */
    async function onRequest() {
        if (busy || !await form.trigger("email", { shouldFocus: true })) return;
        verification.reset();
        request.mutate(form.getValues("email"));
    }

    /** Submits the verification form for its current email and code. */
    const onSubmit = form.handleSubmit(values => {
        if (busy) return;
        if (codeVisible) verification.mutate(values);
        else void onRequest();
    });

    return { t, form, emailInput, codeVisible, busy, request, verification, error, onRequest, onSubmit };
}
