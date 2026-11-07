'use client';

import type { Ref } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/core/ui/dialog';
import { Button } from '@/components/core/ui/button';
import { Textarea } from '@/components/core/ui/textarea';
import { Field, FieldLabel } from '@/components/core/ui/field';
import TypographyBody from '@/components/core/ui/typography-body';
import { useFeatureRequestDialog } from '@/features/tickets/components/hooks/use.feature.request.dialog';
import type { FeatureRequestDialogHandle } from '@/features/tickets/utils/ticket.types';

/** Collects a customer's feature idea as a support ticket. */
export default function FeatureRequestDialog({
    ref,
    user,
}: {
    ref: Ref<FeatureRequestDialogHandle>;
    user: { name: string | null; email: string };
}) {
    const { t, open, inputId, input, error, mutation, changeOpen, submit } =
        useFeatureRequestDialog(ref, user);
    return (
        <Dialog open={open} onOpenChange={changeOpen}>
            <DialogContent
                showCloseButton={false}
                aria-busy={mutation.isPending}
                className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle>
                        <TypographyBody className="font-medium">{t('title')}</TypographyBody>
                    </DialogTitle>
                    <DialogDescription>
                        <TypographyBody className="text-sm text-muted-foreground">
                            {t('description')}
                        </TypographyBody>
                    </DialogDescription>
                </DialogHeader>
                <form noValidate onSubmit={submit}>
                    <fieldset disabled={mutation.isPending} className="min-w-0 space-y-6">
                        <Field className="gap-2">
                            <FieldLabel htmlFor={inputId}>
                                <TypographyBody className="text-sm">{t('label')}</TypographyBody>
                            </FieldLabel>
                            <Textarea
                                id={inputId}
                                {...input}
                                rows={5}
                                className="field-sizing-fixed"
                                aria-invalid={!!error}
                                aria-describedby={error ? `${inputId}-error` : undefined}
                            />
                            {error && (
                                <div id={`${inputId}-error`} role="alert">
                                    <TypographyBody className="text-xs text-destructive">
                                        {error.message}
                                    </TypographyBody>
                                </div>
                            )}
                        </Field>
                        {mutation.isError && (
                            <div role="alert">
                                <TypographyBody className="text-sm text-destructive">
                                    {t('error')}
                                </TypographyBody>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => changeOpen(false)}
                            >
                                <TypographyBody className="text-sm">{t('cancel')}</TypographyBody>
                            </Button>
                            <Button type="submit">
                                <TypographyBody className="text-sm">
                                    {t(mutation.isPending ? 'sending' : 'submit')}
                                </TypographyBody>
                            </Button>
                        </DialogFooter>
                    </fieldset>
                </form>
            </DialogContent>
        </Dialog>
    );
}
