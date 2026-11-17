'use client';

import type { Ref } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/core/ui/dialog';
import { Button } from '@/components/core/ui/button';
import { Field, FieldLabel } from '@/components/core/ui/field';
import { Input } from '@/components/core/ui/input';
import TypographyBody from '@/components/core/ui/typography-body';
import { useLaunchDialog } from '@/features/notifications/components/hooks/use.launch.dialog';
import type { LaunchDialogHandle } from '@/features/notifications/utils/sticker.availability.types';

/** Invites visitors to subscribe to Findee launch and sticker updates. */
export default function LaunchDialog({ ref }: { ref: Ref<LaunchDialogHandle> }) {
    const { t, emailId, isOpen, emailInput, nameInput, errors, mutation, changeOpen, submit } =
        useLaunchDialog(ref);

    return (
        <Dialog open={isOpen} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} aria-busy={mutation.isPending}>
                <DialogHeader>
                    <DialogTitle>
                        <TypographyBody className="font-medium">
                            {t('LaunchDialog.title')}
                        </TypographyBody>
                    </DialogTitle>
                    <DialogDescription>
                        <TypographyBody className="text-sm text-muted-foreground">
                            {t('LaunchDialog.description')}
                        </TypographyBody>
                    </DialogDescription>
                </DialogHeader>
                <form noValidate onSubmit={submit}>
                    <fieldset disabled={mutation.isPending} className="min-w-0 space-y-6">
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
