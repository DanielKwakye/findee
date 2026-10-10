"use client";

import { Controller } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/core/ui/button";
import { Input } from "@/components/core/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/core/ui/input-otp";
import { Field, FieldLabel, FieldError } from "@/components/core/ui/field";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useCustomerOtp } from "@/features/auth/components/hooks/use.customer.otp";

/** Presents email and code entry for customer authentication. */
export function CustomerOtpForm({ onVerified }: { onVerified: (email: string) => void }) {
    const { t, form, emailInput, codeVisible, busy, request, verification, error, onRequest, onSubmit } = useCustomerOtp(onVerified);
    const { errors } = form.formState;

    return (
        <form onSubmit={onSubmit} noValidate aria-busy={busy} className="space-y-4">
            <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="customer-email"><TypographyBody className="text-sm">{t("email")}</TypographyBody></FieldLabel>
                <Input id="customer-email" type="email" autoComplete="email" disabled={busy} {...emailInput}
                    aria-invalid={!!errors.email} aria-describedby={errors.email ? "customer-email-error" : undefined} />
                {errors.email && <FieldError id="customer-email-error"><TypographyBody className="text-sm">{errors.email.message}</TypographyBody></FieldError>}
            </Field>
            {codeVisible && (
                <>
                    <div role="status"><TypographyParagraph className="text-sm text-muted-foreground">{t("codeSent")}</TypographyParagraph></div>
                    <Field data-invalid={!!errors.code}>
                        <FieldLabel htmlFor="customer-code"><TypographyBody className="text-sm">{t("code")}</TypographyBody></FieldLabel>
                        <Controller name="code" control={form.control} rules={{ pattern: /^\d{4}$/, required: true }}
                            render={({ field }) => (
                                <InputOTP id="customer-code" maxLength={4} pattern={REGEXP_ONLY_DIGITS} autoComplete="one-time-code" autoFocus disabled={busy} {...field}
                                    aria-invalid={!!errors.code}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /><InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                </InputOTP>
                            )} />
                    </Field>
                </>
            )}
            {error && <div role="alert"><TypographyParagraph className="text-sm text-destructive">{error}</TypographyParagraph></div>}
            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={busy}><TypographyBody className="text-sm">{t(verification.isPending ? "verifying" : request.isPending ? "sending" : codeVisible ? "verify" : "send")}</TypographyBody></Button>
                {codeVisible && <Button type="button" variant="link" disabled={busy} onClick={onRequest}><TypographyBody className="text-sm">{t("resend")}</TypographyBody></Button>}
            </div>
        </form>
    );
}
