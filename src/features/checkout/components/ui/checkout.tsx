"use client";

import Image from "next/image";
import { Controller } from "react-hook-form";
import { Stepper } from "@/components/platform";
import { Checkbox } from "@/components/core/ui/checkbox";
import { Button } from "@/components/core/ui/button";
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from "@/components/core/ui/field";
import TypographyH3 from "@/components/core/ui/typography-h3";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useCheckout } from "@/features/checkout/components/hooks/use.checkout";
import { checkoutVariants } from "@/features/checkout/data/checkout.variants";
import CheckoutPlans from "@/features/checkout/components/ui/checkout-plans";
import CheckoutAllocation from "@/features/checkout/components/ui/checkout-allocation";
import CheckoutDetails from "@/features/checkout/components/ui/checkout-details";

/** Renders the checkout steps and variant choices. */
export default function Checkout() {
    const { t, form, stepper, steps, currentIndex, continueDisabled, plansQuery, onContinue, onBack,
        variants, plan, allocationTotal, allocationInvalid, allocationOverLimit,
        contactInputs, shippingInput, contactMissing, submission, onPay } = useCheckout();

    return (
        <Stepper steps={steps} currentIndex={currentIndex} onBack={onBack} onContinue={onContinue} continueDisabled={continueDisabled}
            scrollContent
            finalAction={<Button type="button" size="lg" disabled={contactMissing || submission.isPending} onClick={onPay}><TypographyBody className="text-sm">{t(submission.isPending ? "details.submitting" : "details.pay")}</TypographyBody></Button>}
            introduction={(
                <>
                    <TypographyH3 className={stepper.current.id === "variants" ? "text-xl sm:text-2xl xl:text-xl" : "text-lg sm:text-xl xl:text-lg"}>{t(stepper.current.id === "variants" ? "variants.title" : stepper.current.id === "plan" ? "plans.title" : stepper.current.id === "allocation" ? "allocation.title" : "details.title")}</TypographyH3>
                    <TypographyParagraph className={stepper.current.id === "variants" ? "hidden text-muted-foreground xl:block xl:text-sm" : "hidden text-xs leading-5 text-muted-foreground xl:block"}>{t(stepper.current.id === "variants" ? "variants.description" : stepper.current.id === "plan" ? "plans.description" : stepper.current.id === "allocation" ? "allocation.description" : "details.description")}</TypographyParagraph>
                </>
            )}>
            {stepper.current.id === "variants" ? (
                <div className="space-y-6">
                    <Controller name="variants" control={form.control} render={({ field }) => (
                        <FieldGroup aria-label={t("variants.title")} className="gap-2 sm:gap-3 xl:gap-4">
                            {checkoutVariants.map(variant => (
                                <FieldLabel key={variant.id} className="xl:*:data-[slot=field]:p-3">
                                    <Field orientation="horizontal" className="gap-3 sm:gap-5">
                                        <Image src={variant.image} alt={t(`variants.${variant.key}.alt`)}
                                            width={96} height={96} sizes="(min-width: 1280px) 64px, (max-width: 640px) 64px, 96px"
                                            className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24 xl:h-16 xl:w-16" />
                                        <FieldContent>
                                            <FieldTitle><TypographyBody className="text-sm font-bold sm:text-xl xl:text-base">{t(`variants.${variant.key}.title`)}</TypographyBody></FieldTitle>
                                            <TypographyBody className="text-xs text-muted-foreground sm:text-base xl:text-sm">{t(`variants.${variant.key}.description`)}</TypographyBody>
                                        </FieldContent>
                                        <Checkbox name={field.name} value={variant.id}
                                            checked={field.value.includes(variant.id)} onBlur={field.onBlur}
                                            onCheckedChange={checked => field.onChange(checked
                                                ? [...field.value, variant.id]
                                                : field.value.filter(value => value !== variant.id))} />
                                    </Field>
                                </FieldLabel>
                            ))}
                        </FieldGroup>
                    )} />
                </div>
            ) : stepper.current.id === "plan" ? (
                plansQuery.isPending ? (
                    <div role="status"><TypographyParagraph className="text-sm text-muted-foreground">{t("plans.loading")}</TypographyParagraph></div>
                ) : plansQuery.isError ? (
                    <div className="space-y-3">
                        <div role="alert"><TypographyParagraph className="text-sm text-muted-foreground">{t("plans.error")}</TypographyParagraph></div>
                        <Button type="button" variant="secondary" onClick={() => plansQuery.refetch()}>
                            <TypographyBody className="text-sm">{t("plans.retry")}</TypographyBody>
                        </Button>
                    </div>
                ) : (
                    <CheckoutPlans control={form.control} plans={plansQuery.data} />
                )
            ) : stepper.current.id === "allocation" ? (
                <CheckoutAllocation control={form.control} variants={variants} limit={plan?.quantity ?? 0}
                    total={allocationTotal} invalid={allocationInvalid} overLimit={allocationOverLimit} />
            ) : (
                <CheckoutDetails form={form} contactInputs={contactInputs} shippingInput={shippingInput}
                    maxProfiles={plan?.maxRecoveryProfiles ?? null} contactMissing={contactMissing} isSubmitting={submission.isPending} submitError={submission.isError} />
            )}
        </Stepper>
    );
}
