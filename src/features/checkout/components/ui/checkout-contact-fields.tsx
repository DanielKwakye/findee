'use client';

import {
    Controller,
    type FieldErrors,
    type FieldPath,
    type UseFormRegisterReturn,
    type UseFormReturn,
} from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/core/ui/checkbox';
import { Input } from '@/components/core/ui/input';
import { Field, FieldLabel } from '@/components/core/ui/field';
import TypographyBody from '@/components/core/ui/typography-body';
import TypographyParagraph from '@/components/core/ui/typography-paragraph';
import { checkoutContactFields } from '@/features/checkout/data/checkout.contact.fields';
import type { CheckoutContactValues } from '@/features/checkout/utils/checkout.types';

type Props<T extends CheckoutContactValues> = {
    form: Pick<UseFormReturn<T>, 'control' | 'formState'>;
    contactInputs: Record<'email' | 'name' | 'phone', UseFormRegisterReturn>;
    contactMissing: boolean;
    id: string;
};

/** Presents the verified email and the contact details and preferences shared with finders. */
export default function CheckoutContactFields<T extends CheckoutContactValues>({
    form,
    contactInputs,
    contactMissing,
    id,
}: Props<T>) {
    const t = useTranslations('Checkout.details');
    const errors = form.formState.errors as FieldErrors<CheckoutContactValues>;
    return (
        <>
            {checkoutContactFields.map((input) => (
                <Field key={input.name} className="gap-2">
                    <FieldLabel htmlFor={`${id}-${input.name}`}>
                        <TypographyBody className="text-sm">{t(input.name)}</TypographyBody>
                    </FieldLabel>
                    <Input
                        id={`${id}-${input.name}`}
                        type={input.type}
                        autoComplete={input.autoComplete}
                        readOnly={input.name === 'email'}
                        {...contactInputs[input.name]}
                        aria-invalid={!!errors[input.name]}
                        aria-describedby={
                            errors[input.name] ? `${id}-${input.name}-error` : undefined
                        }
                    />
                    {errors[input.name] && (
                        <div id={`${id}-${input.name}-error`} role="alert">
                            <TypographyParagraph className="text-xs text-destructive">
                                {errors[input.name]?.message}
                            </TypographyParagraph>
                        </div>
                    )}
                    <Controller
                        name={input.toggle as FieldPath<T>}
                        control={form.control}
                        render={({ field }) => (
                            <FieldLabel className="w-full items-start gap-2">
                                <Checkbox
                                    name={field.name}
                                    checked={field.value === true}
                                    onCheckedChange={field.onChange}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                />
                                <TypographyBody className="text-xs text-muted-foreground">
                                    {t(input.toggle)}
                                </TypographyBody>
                            </FieldLabel>
                        )}
                    />
                </Field>
            ))}
            {contactMissing && (
                <div role="alert">
                    <TypographyParagraph className="text-xs text-destructive">
                        {t('contactRequired')}
                    </TypographyParagraph>
                </div>
            )}
        </>
    );
}
