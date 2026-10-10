"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/core/ui/button";
import { Checkbox } from "@/components/core/ui/checkbox";
import { Field, FieldLabel } from "@/components/core/ui/field";
import { Input } from "@/components/core/ui/input";
import { Textarea } from "@/components/core/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/core/ui/select";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH3 from "@/components/core/ui/typography-h3";
import CheckoutAllocation from "@/features/checkout/components/ui/checkout-allocation";
import { checkoutVariants } from "@/features/checkout/data/checkout.variants";
import { checkoutContactFields } from "@/features/checkout/data/checkout.contact.fields";
import type { useOrderForm } from "@/features/orders/components/hooks/use.order.form";
import type { FormEventHandler } from "react";

type Props = {
    state: ReturnType<typeof useOrderForm>;
    mutation: { isPending: boolean; isError: boolean };
    submit: FormEventHandler<HTMLFormElement>;
    readOnlyEmail?: boolean;
    submitLabel: string;
    errorMessage: string;
};

/** Renders shared order fields without selecting a create or update action. */
export default function OrderFormFields({ state, mutation, submit, readOnlyEmail = false, submitLabel, errorMessage }: Props) {
    const { t, checkout, form, inputs, plansQuery, planOptions, plan, variants, total, validateAllocation } = state;
    const { errors } = form.formState;
    return <form noValidate onSubmit={submit} className="space-y-6" aria-busy={mutation.isPending}>
        <fieldset disabled={mutation.isPending} className="min-w-0 space-y-6">
            <section className="space-y-4 rounded-xl border p-4">
                <TypographyH3 className="text-base">{t("purchase")}</TypographyH3>
                <div className="grid gap-5 md:grid-cols-2">
                    <Field>
                        <TypographyBody className="text-sm font-medium">{t("variants")}</TypographyBody>
                        <Controller name="variants" control={form.control} rules={inputs.variants} render={({ field }) => <div role="group" aria-label={t("variants")} aria-describedby={errors.variants ? "order-variants-error" : undefined} className="flex flex-wrap gap-4">
                            {checkoutVariants.map(variant => <FieldLabel key={variant.id}>
                                <Checkbox checked={field.value.includes(variant.id)} onCheckedChange={checked => field.onChange(checked
                                    ? [...field.value, variant.id] : field.value.filter(value => value !== variant.id))} onBlur={field.onBlur} />
                                <TypographyBody className="text-sm">{checkout(`variants.${variant.key}.title`)}</TypographyBody>
                            </FieldLabel>)}
                        </div>} />
                        {errors.variants && <div id="order-variants-error" role="alert"><TypographyBody className="text-sm text-destructive">{errors.variants.message}</TypographyBody></div>}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="internal-order-plan"><TypographyBody className="text-sm">{t("plan")}</TypographyBody></FieldLabel>
                        <Controller name="plan" control={form.control} rules={inputs.plan} render={({ field }) => <Select value={field.value || null} onValueChange={value => { if (value) field.onChange(value); }} disabled={plansQuery.isPending || plansQuery.isError || mutation.isPending}>
                            <SelectTrigger id="internal-order-plan" className="w-full" onBlur={field.onBlur} ref={field.ref} aria-invalid={!!errors.plan} aria-describedby={errors.plan ? "order-plan-error" : undefined}>
                                <SelectValue><TypographyBody className="text-sm">{plansQuery.isPending ? t("loading") : planOptions.find(option => option.value === field.value)?.label ?? t("plan")}</TypographyBody></SelectValue>
                            </SelectTrigger>
                            <SelectContent>{planOptions.map(option => <SelectItem key={option.value} value={option.value}><TypographyBody className="text-sm">{option.label}</TypographyBody></SelectItem>)}</SelectContent>
                        </Select>} />
                        {errors.plan && <div id="order-plan-error" role="alert"><TypographyBody className="text-sm text-destructive">{errors.plan.message}</TypographyBody></div>}
                        {plansQuery.isError && <div role="alert" className="space-y-2">
                            <TypographyBody className="text-sm text-destructive">{t("plansError")}</TypographyBody>
                            <Button type="button" variant="outline" onClick={() => plansQuery.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
                        </div>}
                    </Field>
                </div>
                <TypographyBody className="text-sm font-medium">{t("allocation")}</TypographyBody>
                {plan && <CheckoutAllocation control={form.control} variants={variants} limit={plan.quantity} total={total}
                    quantityIsMinimum={!!plan.quantityIsMinimum} onQuantityKeyUp={validateAllocation} error={errors.root?.allocation?.message} />}
                {!plan && errors.root?.allocation && <TypographyBody className="text-sm text-destructive">{errors.root.allocation.message}</TypographyBody>}
            </section>
            <section className="space-y-4 rounded-xl border p-4">
                <TypographyH3 className="text-base">{t("customer")}</TypographyH3>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {checkoutContactFields.map(input => <Field key={input.name}>
                        <FieldLabel htmlFor={`internal-order-${input.name}`}><TypographyBody className="text-sm">{checkout(`details.${input.name}`)}</TypographyBody></FieldLabel>
                        <Input id={`internal-order-${input.name}`} type={input.type} autoComplete={input.autoComplete} readOnly={readOnlyEmail && input.name === "email"} {...inputs[input.name]} aria-invalid={!!errors[input.name]} aria-describedby={errors[input.name] ? `internal-order-${input.name}-error` : undefined} />
                        {errors[input.name] && <div id={`internal-order-${input.name}-error`} role="alert"><TypographyBody className="text-sm text-destructive">{errors[input.name]?.message}</TypographyBody></div>}
                        <Controller name={input.toggle} control={form.control} rules={input.toggle === "showName" ? undefined : inputs.recoveryContact} render={({ field }) => <FieldLabel className="items-start">
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />
                            <TypographyBody className="text-xs text-muted-foreground">{checkout(`details.${input.toggle}`)}</TypographyBody>
                        </FieldLabel>} />
                    </Field>)}
                </div>
                {(errors.contactByEmail || errors.contactByPhone) && <div role="alert"><TypographyBody className="text-sm text-destructive">{errors.contactByEmail?.message ?? errors.contactByPhone?.message}</TypographyBody></div>}
            </section>
            <section className="space-y-4 rounded-xl border p-4">
                <TypographyH3 className="text-base">{t("delivery")}</TypographyH3>
                <div className="grid gap-5 md:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="internal-order-address"><TypographyBody className="text-sm">{checkout("details.shippingAddress")}</TypographyBody></FieldLabel>
                        <Input id="internal-order-address" autoComplete="street-address" {...inputs.shippingAddress} aria-invalid={!!errors.shippingAddress} aria-describedby="internal-order-address-help internal-order-address-error" />
                        <div id="internal-order-address-help"><TypographyBody className="text-xs text-muted-foreground">{checkout("details.addressHelp")}</TypographyBody></div>
                        {errors.shippingAddress && <div id="internal-order-address-error" role="alert"><TypographyBody className="text-sm text-destructive">{errors.shippingAddress.message}</TypographyBody></div>}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="internal-order-instructions"><TypographyBody className="text-sm">{checkout("details.deliveryInstructions")}</TypographyBody></FieldLabel>
                        <Textarea id="internal-order-instructions" rows={4} className="field-sizing-fixed" {...form.register("deliveryInstructions")} />
                    </Field>
                </div>
            </section>
        </fieldset>
        {mutation.isError && <div role="alert"><TypographyBody className="text-sm text-destructive">{errorMessage}</TypographyBody></div>}
        <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending || plansQuery.isPending || plansQuery.isError}><TypographyBody className="text-sm">{mutation.isPending ? t("saving") : submitLabel}</TypographyBody></Button>
        </div>
    </form>;
}
