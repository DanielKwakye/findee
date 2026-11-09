'use client';

import type { Ref } from 'react';
import { XIcon } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/core/ui/dialog';
import { Button } from '@/components/core/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/core/ui/field';
import { Input } from '@/components/core/ui/input';
import TypographyBody from '@/components/core/ui/typography-body';
import { useOrderPaymentDateDialog } from '@/features/orders/components/hooks/use.order.payment.date.dialog';
import type { OrderPaymentDateDialogHandle } from '@/features/orders/utils/order.types';

/** Presents the administrator's order payment date editor. */
export default function OrderPaymentDateDialog({
    ref,
}: {
    ref: Ref<OrderPaymentDateDialogHandle>;
}) {
    const { t, order, form, mutation, input, changeOpen, submit } = useOrderPaymentDateDialog(ref);
    const error = form.formState.errors.paymentDate;
    return (
        <Dialog open={!!order} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false}>
                <DialogHeader className="pr-8">
                    <DialogTitle>
                        <TypographyBody className="font-medium">{t('title')}</TypographyBody>
                    </DialogTitle>
                    <DialogDescription>
                        <TypographyBody className="text-sm text-muted-foreground">
                            {t('description', { number: order?.number ?? '' })}
                        </TypographyBody>
                    </DialogDescription>
                </DialogHeader>
                <DialogClose
                    render={
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute top-4 right-4"
                            aria-label={t('close')}
                            disabled={mutation.isPending}
                        />
                    }
                >
                    <XIcon aria-hidden="true" />
                </DialogClose>
                <form
                    noValidate
                    onSubmit={submit}
                    aria-busy={mutation.isPending}
                    className="space-y-6"
                >
                    <Field data-invalid={!!error}>
                        <FieldLabel htmlFor="order-payment-date">
                            <TypographyBody className="text-sm">{t('date')}</TypographyBody>
                        </FieldLabel>
                        <Input
                            id="order-payment-date"
                            type="date"
                            {...input}
                            disabled={mutation.isPending}
                            aria-invalid={!!error}
                            aria-describedby={error ? 'order-payment-date-error' : undefined}
                        />
                        {error && (
                            <FieldError id="order-payment-date-error">
                                <TypographyBody className="text-sm">{error.message}</TypographyBody>
                            </FieldError>
                        )}
                    </Field>
                    {mutation.isError && (
                        <div role="alert">
                            <TypographyBody className="text-sm text-destructive">
                                {t('saveError')}
                            </TypographyBody>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={mutation.isPending}
                            onClick={() => changeOpen(false)}
                        >
                            <TypographyBody className="text-sm">{t('cancel')}</TypographyBody>
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending || !form.formState.isDirty}
                        >
                            <TypographyBody className="text-sm">
                                {t(mutation.isPending ? 'saving' : 'save')}
                            </TypographyBody>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
