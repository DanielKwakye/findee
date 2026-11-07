'use client';

import { Controller, type Control } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Field, FieldLabel } from '@/components/core/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/core/ui/select';
import TypographyBody from '@/components/core/ui/typography-body';
import { checkoutProvinces } from '@/features/checkout/data/checkout.regions';
import type { CheckoutValues } from '@/features/checkout/utils/checkout.types';

/** Presents the shared country and province fields for shipping destinations. */
export default function CheckoutRegionFields({
    control,
    id,
}: {
    control: Control<CheckoutValues>;
    id: string;
}) {
    const t = useTranslations('Checkout.details');
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {(['country', 'state'] as const).map((name) => (
                <Controller
                    key={name}
                    name={name}
                    control={control}
                    rules={{ required: t(`${name}Required`) }}
                    render={({ field, fieldState }) => (
                        <Field className="min-w-0 gap-2">
                            <FieldLabel htmlFor={`${id}-${name}`}>
                                <TypographyBody className="text-sm">{t(name)}</TypographyBody>
                            </FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    id={`${id}-${name}`}
                                    className="w-full"
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    aria-invalid={!!fieldState.error}
                                    aria-describedby={
                                        fieldState.error ? `${id}-${name}-error` : undefined
                                    }
                                >
                                    <SelectValue>
                                        <TypographyBody className="text-sm">
                                            {field.value
                                                ? name === 'country'
                                                    ? t('canada')
                                                    : t(`provinces.${field.value}`)
                                                : t('statePlaceholder')}
                                        </TypographyBody>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {name === 'country' ? (
                                        <SelectItem value="Canada">
                                            <TypographyBody className="text-sm">
                                                {t('canada')}
                                            </TypographyBody>
                                        </SelectItem>
                                    ) : (
                                        checkoutProvinces.map((province) => (
                                            <SelectItem key={province} value={province}>
                                                <TypographyBody className="text-sm">
                                                    {t(`provinces.${province}`)}
                                                </TypographyBody>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {fieldState.error && (
                                <div id={`${id}-${name}-error`} role="alert">
                                    <TypographyBody className="text-xs text-destructive">
                                        {fieldState.error.message}
                                    </TypographyBody>
                                </div>
                            )}
                        </Field>
                    )}
                />
            ))}
        </div>
    );
}
