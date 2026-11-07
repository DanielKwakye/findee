'use client';

import type { Ref } from 'react';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/core/ui/dialog';
import { Button } from '@/components/core/ui/button';
import TypographyBody from '@/components/core/ui/typography-body';
import { checkoutVariants } from '@/features/checkout/data/checkout.variants';
import { formatCheckoutAddress } from '@/features/checkout/utils/checkout.address';
import { useCheckoutPreview } from '@/features/checkout/components/hooks/use.checkout.preview';
import CheckoutPriceSummary from '@/features/checkout/components/ui/checkout-price-summary';
import type {
    CheckoutPreviewHandle,
    CheckoutValues,
} from '@/features/checkout/utils/checkout.types';

/** Presents the customer's order and shipping details before starting Stripe checkout. */
export default function CheckoutPreviewDialog({
    ref,
    isSubmitting,
    submitError,
    onConfirm,
}: {
    ref: Ref<CheckoutPreviewHandle>;
    isSubmitting: boolean;
    submitError: boolean;
    onConfirm: (values: CheckoutValues) => void;
}) {
    const t = useTranslations('Checkout');
    const { preview, changeOpen, confirm } = useCheckoutPreview(ref, isSubmitting, onConfirm);
    const values = preview?.values;
    return (
        <Dialog open={!!preview} onOpenChange={changeOpen}>
            <DialogContent
                showCloseButton={false}
                className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
                aria-busy={isSubmitting}
            >
                <DialogHeader>
                    <DialogTitle>
                        <TypographyBody className="font-medium">
                            {t('preview.title')}
                        </TypographyBody>
                    </DialogTitle>
                    <DialogDescription>
                        <TypographyBody className="text-sm text-muted-foreground">
                            {t('preview.description')}
                        </TypographyBody>
                    </DialogDescription>
                </DialogHeader>
                {preview && values && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {checkoutVariants
                                .filter((variant) => values.variants.includes(variant.id))
                                .map((variant) => (
                                    <div key={variant.id} className="flex justify-between gap-4">
                                        <TypographyBody className="text-sm">
                                            {t(`variants.${variant.key}.title`)}
                                        </TypographyBody>
                                        <TypographyBody className="text-sm">
                                            {t('preview.quantity', {
                                                quantity: Number(
                                                    values.allocation[variant.id] ?? 0,
                                                ),
                                            })}
                                        </TypographyBody>
                                    </div>
                                ))}
                            <CheckoutPriceSummary plan={preview.plan} />
                        </div>
                        <div className="space-y-1 break-words *:block">
                            <TypographyBody className="text-sm font-semibold">
                                {t('preview.contact')}
                            </TypographyBody>
                            <TypographyBody className="text-sm">{values.name}</TypographyBody>
                            <TypographyBody className="text-sm">{values.email}</TypographyBody>
                            {values.phone && (
                                <TypographyBody className="text-sm">{values.phone}</TypographyBody>
                            )}
                            <TypographyBody className="text-xs text-muted-foreground">
                                {t('preview.recoveryContact', {
                                    email: t(
                                        values.contactByEmail
                                            ? 'preview.enabled'
                                            : 'preview.disabled',
                                    ),
                                    phone: t(
                                        values.contactByPhone
                                            ? 'preview.enabled'
                                            : 'preview.disabled',
                                    ),
                                    name: t(
                                        values.showName ? 'preview.enabled' : 'preview.disabled',
                                    ),
                                })}
                            </TypographyBody>
                        </div>
                        <div className="space-y-1 break-words *:block">
                            <TypographyBody className="text-sm font-semibold">
                                {t('details.shippingAddress')}
                            </TypographyBody>
                            <TypographyBody className="text-sm">
                                {formatCheckoutAddress(values)}
                            </TypographyBody>
                        </div>
                        {values.deliveryInstructions.trim() && (
                            <div className="space-y-1 *:block">
                                <TypographyBody className="text-sm font-semibold">
                                    {t('details.deliveryInstructions')}
                                </TypographyBody>
                                <TypographyBody className="text-sm whitespace-pre-wrap break-words">
                                    {values.deliveryInstructions}
                                </TypographyBody>
                            </div>
                        )}
                    </div>
                )}
                {submitError && (
                    <div role="alert">
                        <TypographyBody className="text-sm text-destructive">
                            {t('details.submitError')}
                        </TypographyBody>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={isSubmitting}
                        onClick={() => changeOpen(false)}
                    >
                        <TypographyBody className="text-sm">{t('preview.edit')}</TypographyBody>
                    </Button>
                    <Button type="button" disabled={isSubmitting} onClick={confirm}>
                        <TypographyBody className="text-sm">
                            {t(isSubmitting ? 'details.submitting' : 'preview.confirm')}
                        </TypographyBody>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
