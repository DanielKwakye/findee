"use client";

import { Button } from "@/components/core/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/core/ui/card";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/core/ui/field";
import { Input } from "@/components/core/ui/input";
import TypographyH3 from "@/components/core/ui/typography-h3";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useLogin } from "@/features/auth/components/hooks/use.login";
import { isValidEmail } from "@/features/auth/utils/auth.validation";

/** Renders the credentials-only sign-in card and accessible form feedback. */
export function LoginForm() {
    const { form, mutation, error, t } = useLogin();
    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <TypographyH3 className="text-base font-medium tracking-normal">{t("title")}</TypographyH3>
                <TypographyParagraph className="text-sm leading-5 text-muted-foreground">{t("description")}</TypographyParagraph>
            </CardHeader>
            <form
                onSubmit={handleSubmit((values) => mutation.mutate(values))}
                noValidate
                aria-busy={mutation.isPending}
            >
                <CardContent className="pb-6">
                    <FieldGroup>
                        <Field data-invalid={!!errors.email}>
                            <FieldLabel htmlFor="email">
                                <TypographyBody className="text-sm font-medium">{t("email")}</TypographyBody>
                            </FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="username"
                                placeholder={t("emailPlaceholder")}
                                disabled={mutation.isPending}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                {...register("email", {
                                    required: t("emailRequired"),
                                    validate: (value) => isValidEmail(value) || t("emailInvalid"),
                                })}
                            />
                            {errors.email && (
                                <FieldError id="email-error">
                                    <TypographyBody className="text-sm">{errors.email.message}</TypographyBody>
                                </FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.password}>
                            <FieldLabel htmlFor="password">
                                <TypographyBody className="text-sm font-medium">{t("password")}</TypographyBody>
                            </FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                disabled={mutation.isPending}
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                {...register("password", {
                                    required: t("passwordRequired"),
                                    maxLength: { value: 1024, message: t("passwordInvalid") },
                                })}
                            />
                            {errors.password && (
                                <FieldError id="password-error">
                                    <TypographyBody className="text-sm">{errors.password.message}</TypographyBody>
                                </FieldError>
                            )}
                        </Field>
                        {error && <FieldError><TypographyBody className="text-sm">{error}</TypographyBody></FieldError>}
                    </FieldGroup>
                </CardContent>
                <CardFooter className="border-t">
                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        <TypographyBody className="text-sm font-medium">{t(mutation.isPending ? "loggingIn" : "login")}</TypographyBody>
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
