'use client';

import type { Ref } from 'react';
import { Controller } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/core/ui/dialog';
import { Button } from '@/components/core/ui/button';
import { Checkbox } from '@/components/core/ui/checkbox';
import { Field, FieldLabel } from '@/components/core/ui/field';
import { Input } from '@/components/core/ui/input';
import TypographyBody from '@/components/core/ui/typography-body';
import { useStickerAvailabilityDialog } from '@/features/notifications/components/hooks/use.sticker.availability.dialog';
import type { StickerAvailabilityDialogHandle } from '@/features/notifications/utils/sticker.availability.types';

/** Collects an email address for notifications about a selected sticker variant. */
export default function StickerAvailabilityDialog({
    ref,
}: {
    ref: Ref<StickerAvailabilityDialogHandle>;
}) {
    const {
        t,
        variant,
        title,
        notificationVariants,
        control,
        variantRules,
        onVariantChange,
        emailId,
        emailInput,
        nameInput,
        errors,
        mutation,
        changeOpen,
        submit,
    } = useStickerAvailabilityDialog(ref);
    return (
        <Dialog open={!!variant} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} aria-busy={mutation.isPending}>
                <DialogHeader>
                    <DialogTitle>
                        <TypographyBody className="font-medium">{title}</TypographyBody>
                    </DialogTitle>
                    <DialogDescription>
                        <TypographyBody className="text-sm text-muted-foreground">
                            {t('StickerAvailability.description')}
                        </TypographyBody>
                    </DialogDescription>
                </DialogHeader>
                <form noValidate onSubmit={submit}>
                    <fieldset disabled={mutation.isPending} className="min-w-0 space-y-6">
                        <Controller
                            name="variants"
                            control={control}
                            rules={variantRules}
                            render={({ field }) => (
                                <Field className="gap-2">
                                    <div
                                        role="group"
                                        aria-label={t('StickerAvailability.variants')}
                                        aria-describedby={
                                            errors.variants
                                                ? `${emailId}-variants-error`
                                                : undefined
                                        }
                                        className="flex flex-wrap gap-4"
                                    >
                                        {notificationVariants.map((option) => (
                                            <FieldLabel key={option.id}>
                                                <Checkbox
                                                    name={field.name}
                                                    value={option.id}
                                                    checked={field.value.includes(option.id)}
                                                    onCheckedChange={(checked) =>
                                                        onVariantChange(option.id, checked)
                                                    }
                                                    onBlur={field.onBlur}
                                                    ref={
                                                        option.id === notificationVariants[0]?.id
                                                            ? field.ref
                                                            : undefined
                                                    }
                                                    aria-invalid={!!errors.variants}
                                                />
                                                <TypographyBody className="text-sm">
                                                    {t(`Checkout.variants.${option.key}.title`)}
                                                </TypographyBody>
                                            </FieldLabel>
                                        ))}
                                    </div>
                                    {errors.variants && (
                                        <div id={`${emailId}-variants-error`} role="alert">
                                            <TypographyBody className="text-xs text-destructive">
                                                {errors.variants.message}
                                            </TypographyBody>
                                        </div>
                                    )}
                                </Field>
                            )}
                        />
                        <Field className="gap-2">
                            <FieldLabel htmlFor={`${emailId}-name`}>
                                <TypographyBody className="text-sm">
                                    {t('StickerAvailability.name')}
                                </TypographyBody>
                            </FieldLabel>
                            <Input
                                id={`${emailId}-name`}
                                autoComplete="name"
                                {...nameInput}
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? `${emailId}-name-error` : undefined}
                            />
                            {errors.name && (
                                <div id={`${emailId}-name-error`} role="alert">
                                    <TypographyBody className="text-xs text-destructive">
                                        {errors.name.message}
                                    </TypographyBody>
                                </div>
                            )}
                        </Field>
                        <Field className="gap-2">
                            <FieldLabel htmlFor={emailId}>
                                <TypographyBody className="text-sm">
                                    {t('Checkout.details.email')}
                                </TypographyBody>
                            </FieldLabel>
                            <Input
                                id={emailId}
                                type="email"
                                autoComplete="email"
                                {...emailInput}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? `${emailId}-error` : undefined}
                            />
                            {errors.email && (
                                <div id={`${emailId}-error`} role="alert">
                                    <TypographyBody className="text-xs text-destructive">
                                        {errors.email.message}
                                    </TypographyBody>
                                </div>
                            )}
                        </Field>
                        {mutation.isError && (
                            <div role="alert">
                                <TypographyBody className="text-sm text-destructive">
                                    {t('StickerAvailability.error')}
                                </TypographyBody>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => changeOpen(false)}
                            >
                                <TypographyBody className="text-sm">
                                    {t('StickerAvailability.close')}
                                </TypographyBody>
                            </Button>
                            <Button type="submit">
                                <TypographyBody className="text-sm">
                                    {t(
                                        mutation.isPending
                                            ? 'StickerAvailability.subscribing'
                                            : 'Pricing.notifyMe',
                                    )}
                                </TypographyBody>
                            </Button>
                        </DialogFooter>
                    </fieldset>
                </form>
            </DialogContent>
        </Dialog>
    );
}
