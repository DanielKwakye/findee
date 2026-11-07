'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/core/ui/button';
import { Badge } from '@/components/core/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/core/ui/card';
import TypographyBody from '@/components/core/ui/typography-body';
import TypographyParagraph from '@/components/core/ui/typography-paragraph';
import TypographyH3 from '@/components/core/ui/typography-h3';
import { usePricing } from '@/features/pricing/components/hooks/use.pricing';
import StickerAvailabilityDialog from '@/features/notifications/components/ui/sticker-availability-dialog';

/** Presents checkout's sticker plans for comparison before purchase. */
export default function PricingPlans() {
    const t = useTranslations('Pricing');
    const tPlans = useTranslations('Checkout.plans');
    const tCheckout = useTranslations('Checkout');
    const tItems = useTranslations('EverydayItems');
    const format = useFormatter();
    const { plansQuery: plans, onNotify, notificationDialogRef } = usePricing();

    return (
        <section
            aria-label={t('plansLabel')}
            className="container mx-auto px-5 pb-12 sm:px-6 sm:pb-20"
        >
            {plans.isPending ? (
                <div role="status" className="py-12 text-center">
                    <TypographyParagraph className="text-muted-foreground">
                        {tPlans('loading')}
                    </TypographyParagraph>
                </div>
            ) : plans.isError ? (
                <div className="space-y-4 py-12 text-center">
                    <div role="alert">
                        <TypographyParagraph className="text-muted-foreground">
                            {tPlans('error')}
                        </TypographyParagraph>
                    </div>
                    <Button variant="secondary" onClick={() => plans.refetch()}>
                        <TypographyBody>{tPlans('retry')}</TypographyBody>
                    </Button>
                </div>
            ) : (
                <>
                    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
                        {plans.data.map((variant) => (
                            <Card
                                key={variant.id}
                                className="gap-6 border border-border py-6 ring-0"
                            >
                                <CardHeader className="gap-3">
                                    <Image
                                        src={variant.image}
                                        alt={tCheckout(`variants.${variant.key}.alt`)}
                                        width={640}
                                        height={360}
                                        sizes="(min-width: 1024px) 33vw, 100vw"
                                        className="mb-2 aspect-video w-full rounded-xl object-cover"
                                    />
                                    <div className="flex flex-wrap items-center gap-2">
                                        <TypographyH3 className="text-xl">
                                            {t(`variants.${variant.key}.title`)}
                                        </TypographyH3>
                                        {!variant.comingSoon ? (
                                            <Badge
                                                variant="secondary"
                                                className="bg-success/15 text-success"
                                            >
                                                <TypographyBody className="text-xs">
                                                    {t('active')}
                                                </TypographyBody>
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                <TypographyBody className="text-xs">
                                                    {tCheckout('comingSoon')}
                                                </TypographyBody>
                                            </Badge>
                                        )}
                                    </div>
                                    <TypographyParagraph className="text-sm text-muted-foreground">
                                        {t(`variants.${variant.key}.description`)}
                                    </TypographyParagraph>
                                    {variant.id === 'Everyday' && (
                                        <Link
                                            href="/everyday-items"
                                            aria-label={tItems('linkLabel')}
                                            className="w-fit text-primary underline-offset-4 hover:underline"
                                        >
                                            <TypographyBody className="text-xs">
                                                {tItems('seeFullList')}
                                            </TypographyBody>
                                        </Link>
                                    )}
                                    {!variant.comingSoon && (
                                        <div className="flex flex-col items-start gap-1.5 pt-2">
                                            <TypographyBody className="text-xs text-muted-foreground">
                                                {t('startingAt')}
                                            </TypographyBody>
                                            <TypographyBody className="text-3xl font-bold tracking-tight">
                                                {format.number(variant.startingPrice, {
                                                    style: 'currency',
                                                    currency: variant.currency,
                                                    currencyDisplay: 'code',
                                                    maximumFractionDigits: 5,
                                                })}
                                            </TypographyBody>
                                            <TypographyBody className="text-xs text-muted-foreground">
                                                {t('perSticker')}
                                            </TypographyBody>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="flex-1">
                                    {!variant.comingSoon ? (
                                        <ul className="space-y-4 border-t border-border pt-5">
                                            {variant.tiers.map((tier) => (
                                                <li
                                                    key={tier.minimum}
                                                    className="flex items-start gap-2"
                                                >
                                                    <Check
                                                        aria-hidden="true"
                                                        className="mt-0.5 size-4 shrink-0 text-primary"
                                                    />
                                                    <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                                        <TypographyBody className="text-sm text-muted-foreground">
                                                            {t(
                                                                tier.maximum === null
                                                                    ? 'quantityFrom'
                                                                    : 'quantityRange',
                                                                {
                                                                    minimum: tier.minimum,
                                                                    maximum:
                                                                        tier.maximum ??
                                                                        tier.minimum,
                                                                },
                                                            )}
                                                        </TypographyBody>
                                                        <TypographyBody className="text-sm font-semibold">
                                                            {tPlans('perUnit', {
                                                                price: format.number(tier.price, {
                                                                    style: 'currency',
                                                                    currency: variant.currency,
                                                                    currencyDisplay: 'code',
                                                                    maximumFractionDigits: 5,
                                                                }),
                                                            })}
                                                        </TypographyBody>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="space-y-3 border-t border-border pt-5">
                                            <TypographyParagraph className="text-sm">
                                                {t('affordabilityAssurance')}
                                            </TypographyParagraph>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex-col gap-3">
                                    {!variant.comingSoon ? (
                                        <Button
                                            render={
                                                <Link
                                                    href={`/checkout?variant=${variant.id.toLowerCase()}`}
                                                    aria-label={t('chooseVariant', {
                                                        variant: t(`variants.${variant.key}.title`),
                                                    })}
                                                />
                                            }
                                            nativeButton={false}
                                            className="h-11 w-full gap-2"
                                        >
                                            <TypographyBody className="font-semibold">
                                                {t('getStickers')}
                                            </TypographyBody>
                                            <ArrowRight aria-hidden="true" className="size-4" />
                                        </Button>
                                    ) : (
                                        <>
                                            <TypographyParagraph className="w-full text-sm text-muted-foreground">
                                                {t(`variants.${variant.key}.notificationPrompt`)}
                                            </TypographyParagraph>
                                            <Button
                                                type="button"
                                                className="h-11 w-full gap-2"
                                                onClick={() => onNotify(variant.id)}
                                            >
                                                <TypographyBody className="font-semibold">
                                                    {t('notifyMe')}
                                                </TypographyBody>
                                            </Button>
                                        </>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            )}
            <StickerAvailabilityDialog ref={notificationDialogRef} />
        </section>
    );
}
