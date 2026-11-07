'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/core/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/core/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/ui/tabs';
import TypographyBody from '@/components/core/ui/typography-body';
import TypographyParagraph from '@/components/core/ui/typography-paragraph';
import { useUseCases } from '@/features/use-cases/components/hooks/use.use.cases';
import { useCaseGroups } from '@/features/use-cases/data/use.cases';

/** Presents everyday and family use cases in a paged card carousel. */
export default function UseCases() {
    const t = useTranslations('UseCases');
    const tVariants = useTranslations('Checkout.variants');
    const tItems = useTranslations('EverydayItems');
    const pageSize = useUseCases();

    return (
        <section
            aria-label={t('regionLabel')}
            className="container mx-auto px-4 pt-0 pb-8 sm:px-6 lg:pb-12"
        >
            <Tabs defaultValue={useCaseGroups[0].variant} className="gap-4">
                <TabsList
                    variant="line"
                    aria-label={t('regionLabel')}
                    className="mx-auto w-full lg:max-w-sm"
                >
                    {useCaseGroups.map((group) => (
                        <TabsTrigger key={group.variant} value={group.variant}>
                            <TypographyBody className="text-sm">
                                {tVariants(`${group.key}.title`)}
                            </TypographyBody>
                        </TabsTrigger>
                    ))}
                </TabsList>
                {useCaseGroups.map((group) => {
                    const pageCount = Math.ceil(group.items.length / pageSize);
                    return (
                        <TabsContent key={group.variant} value={group.variant}>
                            {group.variant === 'Everyday' && (
                                <div className="flex justify-end py-2">
                                    <Link
                                        href="/everyday-items"
                                        aria-label={tItems('linkLabel')}
                                        className="text-primary underline-offset-4 hover:underline"
                                    >
                                        <TypographyBody className="text-xs">
                                            {tItems('seeFullList')}
                                        </TypographyBody>
                                    </Link>
                                </div>
                            )}
                            <Carousel
                                key={pageSize}
                                opts={{ align: 'start' }}
                                aria-label={tVariants(`${group.key}.title`)}
                            >
                                <CarouselContent>
                                    {Array.from({ length: pageCount }, (_, page) => (
                                        <CarouselItem
                                            key={page}
                                            aria-label={t('pageLabel', {
                                                number: page + 1,
                                                total: pageCount,
                                            })}
                                        >
                                            <div className="grid grid-cols-1 gap-3 py-4 lg:grid-cols-3 lg:gap-6 lg:p-4">
                                                {group.items
                                                    .slice(page * pageSize, (page + 1) * pageSize)
                                                    .map(({ key, image, variant }) => (
                                                        <Link
                                                            key={key}
                                                            href={`/checkout?variant=${variant}`}
                                                            className="group rounded-2xl outline-none transition-[scale] duration-300 ease-in-out hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none motion-reduce:scale-100 motion-reduce:transition-none"
                                                        >
                                                            <Card className="h-full gap-0 border border-border pt-0 pb-0 ring-0 transition-shadow group-hover:shadow-[0_0_12px_2px_var(--tw-shadow-color)] group-hover:shadow-chart-2/10 group-focus-visible:shadow-[0_0_12px_2px_var(--tw-shadow-color)] group-focus-visible:shadow-chart-2/10">
                                                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                                                    <Image
                                                                        src={image}
                                                                        alt=""
                                                                        fill
                                                                        sizes="(min-width: 1024px) 33vw, 100vw"
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <CardContent className="flex flex-col gap-2 p-3 sm:p-5">
                                                                    <TypographyBody className="text-sm font-semibold sm:text-lg">
                                                                        {t(`items.${key}.title`)}
                                                                    </TypographyBody>
                                                                    <TypographyParagraph className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                                                                        {t(
                                                                            `items.${key}.description`,
                                                                        )}
                                                                    </TypographyParagraph>
                                                                </CardContent>
                                                            </Card>
                                                        </Link>
                                                    ))}
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="mt-6 flex justify-center gap-4">
                                    <CarouselPrevious
                                        aria-label={t('previous')}
                                        className="static size-10"
                                    />
                                    <CarouselNext
                                        aria-label={t('next')}
                                        className="static size-10"
                                    />
                                </div>
                            </Carousel>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </section>
    );
}
