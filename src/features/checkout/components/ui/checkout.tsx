'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useFormatter, useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { Stepper } from '@/components/platform';
import { Checkbox } from '@/components/core/ui/checkbox';
import { Button } from '@/components/core/ui/button';
import { Badge } from '@/components/core/ui/badge';
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from '@/components/core/ui/field';
import TypographyH3 from '@/components/core/ui/typography-h3';
import TypographyBody from '@/components/core/ui/typography-body';
import TypographyParagraph from '@/components/core/ui/typography-paragraph';
import { useCheckout } from '@/features/checkout/components/hooks/use.checkout';
import {
    checkoutVariants,
    checkoutComingSoonVariants,
    type CheckoutVariant,
} from '@/features/checkout/data/checkout.variants';
import CheckoutPlans from '@/features/checkout/components/ui/checkout-plans';
import CheckoutAllocation from '@/features/checkout/components/ui/checkout-allocation';
import CheckoutDetails from '@/features/checkout/components/ui/checkout-details';
import CheckoutPriceSummary from '@/features/checkout/components/ui/checkout-price-summary';
import CheckoutPreviewDialog from '@/features/checkout/components/ui/checkout-preview-dialog';
import { CustomerOtpForm } from '@/features/auth/components/ui/customer-otp-form';
import type { CheckoutCustomer, CheckoutPlan } from '@/features/checkout/utils/checkout.types';
import StickerAvailabilityDialog from '@/features/notifications/components/ui/sticker-availability-dialog';

/** Renders the checkout steps and variant choices. */
export default function Checkout({
    customer,
    initialPlan,
    initialVariant,
}: {
    customer: CheckoutCustomer | null;
    initialPlan?: CheckoutPlan['id'];
    initialVariant?: CheckoutVariant;
}) {
    const format = useFormatter();
    const tPricing = useTranslations('Pricing');
    const tItems = useTranslations('EverydayItems');
    const {
        t,
        form,
        stepper,
        steps,
        currentIndex,
        continueDisabled,
        plansQuery,
        onContinue,
        onBack,
        variants,
        plan,
        checkoutPlans,
        allocationTotal,
        allocationError,
        onAllocationKeyUp,
        contactInputs,
        shippingInput,
        postalCodeRules,
        onPostalCodePaste,
        deliveryEstimate,
        contactMissing,
        submission,
        onPay,
        previewRef,
        onConfirmPayment,
        onVerified,
        notificationDialogRef,
        onVariantChange,
    } = useCheckout(customer, initialPlan, initialVariant);

    return (
        <Stepper
            steps={steps}
            currentIndex={currentIndex}
            onBack={onBack}
            onContinue={onContinue}
            continueDisabled={continueDisabled}
            continueLabel={
                stepper.current.id === 'allocation' && plan
                    ? t('allocation.continueWithAmount', {
                          amount: format.number(plan.price, {
                              style: 'currency',
                              currency: plan.currency,
                              currencyDisplay: 'code',
                          }),
                      })
                    : undefined
            }
            hideContinue={stepper.current.id === 'verification'}
            finalAction={
                <Button
                    type="button"
                    size="lg"
                    disabled={contactMissing || submission.isPending}
                    onClick={onPay}
                >
                    <TypographyBody className="text-sm">
                        {submission.isPending
                            ? t('details.submitting')
                            : plan
                              ? t('preview.reviewWithAmount', {
                                    amount: format.number(plan.price, {
                                        style: 'currency',
                                        currency: plan.currency,
                                        currencyDisplay: 'code',
                                    }),
                                })
                              : t('preview.title')}
                    </TypographyBody>
                </Button>
            }
            introduction={
                <>
                    <TypographyH3
                        className={
                            stepper.current.id === 'variants'
                                ? 'text-xl sm:text-2xl xl:text-xl'
                                : 'text-lg sm:text-xl xl:text-lg'
                        }
                    >
                        {t(
                            stepper.current.id === 'variants'
                                ? 'variants.title'
                                : stepper.current.id === 'plan'
                                  ? 'plans.title'
                                  : stepper.current.id === 'allocation'
                                    ? 'allocation.title'
                                    : stepper.current.id === 'verification'
                                      ? 'verification.title'
                                      : 'details.title',
                        )}
                    </TypographyH3>
                    <TypographyParagraph
                        className={
                            stepper.current.id === 'variants'
                                ? 'hidden text-muted-foreground xl:block xl:text-sm'
                                : 'hidden text-xs leading-5 text-muted-foreground xl:block'
                        }
                    >
                        {t(
                            stepper.current.id === 'variants'
                                ? 'variants.description'
                                : stepper.current.id === 'plan'
                                  ? 'plans.description'
                                  : stepper.current.id === 'allocation'
                                    ? 'allocation.description'
                                    : stepper.current.id === 'verification'
                                      ? 'verification.description'
                                      : 'details.description',
                        )}
                    </TypographyParagraph>
                </>
            }
        >
            {stepper.current.id === 'variants' ? (
                <div className="space-y-6">
                    <Controller
                        name="variants"
                        control={form.control}
                        render={({ field }) => (
                            <FieldGroup
                                aria-label={t('variants.title')}
                                className="gap-2 sm:gap-3 xl:gap-4"
                            >
                                {checkoutVariants.map((variant) => (
                                    <div key={variant.id} className="space-y-2">
                                        <FieldLabel className="w-full xl:*:data-[slot=field]:p-3">
                                            <Field
                                                orientation="horizontal"
                                                className="gap-3 sm:gap-5"
                                            >
                                                <Image
                                                    src={variant.image}
                                                    alt={t(`variants.${variant.key}.alt`)}
                                                    width={96}
                                                    height={96}
                                                    sizes="(min-width: 1280px) 64px, (max-width: 640px) 64px, 96px"
                                                    className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24 xl:h-16 xl:w-16"
                                                />
                                                <FieldContent>
                                                    <FieldTitle className="flex-wrap">
                                                        <TypographyBody className="text-sm font-bold sm:text-xl xl:text-base">
                                                            {t(`variants.${variant.key}.title`)}
                                                        </TypographyBody>
                                                        <Badge
                                                            variant="secondary"
                                                            className={
                                                                checkoutComingSoonVariants[
                                                                    variant.id
                                                                ]
                                                                    ? undefined
                                                                    : 'bg-success/15 text-success'
                                                            }
                                                        >
                                                            <TypographyBody className="text-xs">
                                                                {checkoutComingSoonVariants[
                                                                    variant.id
                                                                ]
                                                                    ? t('comingSoon')
                                                                    : tPricing('active')}
                                                            </TypographyBody>
                                                        </Badge>
                                                    </FieldTitle>
                                                    <TypographyBody className="text-xs text-muted-foreground sm:text-base xl:text-sm">
                                                        {t(`variants.${variant.key}.description`)}
                                                        {variant.id === 'Everyday' && (
                                                            <>
                                                                {' '}
                                                                <Link
                                                                    href="/everyday-items"
                                                                    aria-label={tItems('linkLabel')}
                                                                    className="text-primary underline-offset-4 hover:underline"
                                                                >
                                                                    <TypographyBody className="text-xs">
                                                                        {tItems('seeFullList')}
                                                                    </TypographyBody>
                                                                </Link>
                                                            </>
                                                        )}
                                                    </TypographyBody>
                                                </FieldContent>
                                                <Checkbox
                                                    name={field.name}
                                                    value={variant.id}
                                                    checked={field.value.includes(variant.id)}
                                                    onBlur={field.onBlur}
                                                    onCheckedChange={(checked) =>
                                                        onVariantChange(variant.id, checked)
                                                    }
                                                />
                                            </Field>
                                        </FieldLabel>
                                    </div>
                                ))}
                            </FieldGroup>
                        )}
                    />
                </div>
            ) : stepper.current.id === 'plan' ? (
                plansQuery.isPending ? (
                    <div role="status">
                        <TypographyParagraph className="text-sm text-muted-foreground">
                            {t('plans.loading')}
                        </TypographyParagraph>
                    </div>
                ) : plansQuery.isError ? (
                    <div className="space-y-3">
                        <div role="alert">
                            <TypographyParagraph className="text-sm text-muted-foreground">
                                {t('plans.error')}
                            </TypographyParagraph>
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => plansQuery.refetch()}
                        >
                            <TypographyBody className="text-sm">{t('plans.retry')}</TypographyBody>
                        </Button>
                    </div>
                ) : (
                    <CheckoutPlans control={form.control} plans={checkoutPlans ?? []} />
                )
            ) : stepper.current.id === 'allocation' ? (
                <CheckoutAllocation
                    control={form.control}
                    variants={variants}
                    limit={plan?.quantity ?? 0}
                    plan={plan}
                    total={allocationTotal}
                    error={allocationError}
                    quantityIsMinimum={!!plan?.quantityIsMinimum}
                    onQuantityKeyUp={onAllocationKeyUp}
                />
            ) : stepper.current.id === 'verification' ? (
                <CustomerOtpForm onVerified={onVerified} />
            ) : (
                <>
                    <CheckoutDetails
                        form={form}
                        contactInputs={contactInputs}
                        shippingInput={shippingInput}
                        postalCodeRules={postalCodeRules}
                        onPostalCodePaste={onPostalCodePaste}
                        deliveryEstimate={deliveryEstimate}
                        contactMissing={contactMissing}
                        isSubmitting={submission.isPending}
                        submitError={submission.isError}
                    />
                    {plan && <CheckoutPriceSummary plan={plan} />}
                </>
            )}
            <CheckoutPreviewDialog
                ref={previewRef}
                isSubmitting={submission.isPending}
                submitError={submission.isError}
                onConfirm={onConfirmPayment}
            />
            <StickerAvailabilityDialog ref={notificationDialogRef} />
        </Stepper>
    );
}
