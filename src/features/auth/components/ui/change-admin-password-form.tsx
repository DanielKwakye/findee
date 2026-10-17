"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/core/ui/card";
import { Button } from "@/components/core/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/core/ui/field";
import { Input } from "@/components/core/ui/input";
import TypographyBody from "@/components/core/ui/typography-body";
import { useChangeAdminPassword } from "@/features/auth/components/hooks/use.change.admin.password";

/** Presents the mandatory password change within the administrator portal. */
export default function ChangeAdminPasswordForm() {
    const { t, tAuth, form, inputs, mutation, submit, logout } = useChangeAdminPassword();
    const { errors } = form.formState;
    return (
        <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle><TypographyBody className="font-medium">{t("title")}</TypographyBody></CardTitle>
                    <CardDescription><TypographyBody className="text-sm text-muted-foreground">{t("description")}</TypographyBody></CardDescription>
                </CardHeader>
                <form noValidate onSubmit={submit} aria-busy={mutation.isPending} className="space-y-6">
                    <CardContent className="space-y-4">
                    <fieldset disabled={mutation.isPending || logout.isPending} className="min-w-0 space-y-4">
                        <Field data-invalid={!!errors.password}>
                            <FieldLabel htmlFor="new-admin-password"><TypographyBody className="text-sm">{t("password")}</TypographyBody></FieldLabel>
                            <Input id="new-admin-password" type="password" autoComplete="new-password" {...inputs.password} aria-invalid={!!errors.password} aria-describedby={errors.password ? "new-admin-password-error" : undefined} />
                            {errors.password && <FieldError id="new-admin-password-error"><TypographyBody className="text-sm">{errors.password.message}</TypographyBody></FieldError>}
                        </Field>
                        <Field data-invalid={!!errors.confirmPassword}>
                            <FieldLabel htmlFor="confirm-admin-password"><TypographyBody className="text-sm">{t("confirmPassword")}</TypographyBody></FieldLabel>
                            <Input id="confirm-admin-password" type="password" autoComplete="new-password" {...inputs.confirmPassword} aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? "confirm-admin-password-error" : undefined} />
                            {errors.confirmPassword && <FieldError id="confirm-admin-password-error"><TypographyBody className="text-sm">{errors.confirmPassword.message}</TypographyBody></FieldError>}
                        </Field>
                    </fieldset>
                    {mutation.isError && <div role="alert"><TypographyBody className="text-sm text-destructive">{t("error")}</TypographyBody></div>}
                    {logout.isError && <div role="alert"><TypographyBody className="text-sm text-destructive">{tAuth("logoutError")}</TypographyBody></div>}
                    </CardContent>
                    <CardFooter className="flex-col gap-2 border-t">
                        <Button type="submit" className="w-full" disabled={mutation.isPending || logout.isPending}><TypographyBody className="text-sm">{t(mutation.isPending ? "saving" : "save")}</TypographyBody></Button>
                        <Button type="button" variant="secondary" className="w-full" disabled={mutation.isPending || logout.isPending} onClick={() => logout.mutate()}><TypographyBody className="text-sm">{tAuth(logout.isPending ? "loggingOut" : "logout")}</TypographyBody></Button>
                    </CardFooter>
                </form>
        </Card>
    );
}
