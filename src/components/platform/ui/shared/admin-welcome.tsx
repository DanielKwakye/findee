'use client';

import { ArrowUpLeft, HeartHandshake, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/core/ui/card';
import { Badge } from '@/components/core/ui/badge';
import TypographyH1 from '@/components/core/ui/typography-h1';
import TypographyBody from '@/components/core/ui/typography-body';
import TypographyParagraph from '@/components/core/ui/typography-paragraph';
import { useAdminWelcome } from '@/components/platform/hooks/use.admin.welcome';

/** Presents a personalized introduction to the administrator's workspace. */
export default function AdminWelcome({
    name,
    quoteKey,
    departments,
}: {
    name: string | null;
    quoteKey: string;
    departments: string[];
}) {
    const t = useTranslations('AdminWelcome');
    const tNavigation = useTranslations('PortalNavigation');
    const { period, firstName, links } = useAdminWelcome(name, departments);
    return (
        <section className="mx-auto w-full max-w-3xl py-6 sm:py-12">
            <Card className="gap-0">
                <CardHeader className="justify-items-start gap-6 px-6 pt-6 pb-2 text-left sm:px-10 sm:pt-10">
                    <Badge variant="outline" className="gap-2 bg-background">
                        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                        <TypographyBody className="text-xs">{t('eyebrow')}</TypographyBody>
                    </Badge>
                    <div className="space-y-3">
                        <TypographyH1 className="text-3xl tracking-tight sm:text-4xl">
                            {firstName
                                ? t(`greetings.${period}Personal`, { name: firstName })
                                : t(`greetings.${period}`)}
                        </TypographyH1>
                    </div>
                </CardHeader>
                <CardContent className="px-6 pt-2 pb-7 sm:px-10">
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                            <HeartHandshake
                                className="size-6"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        </div>
                        <div className="space-y-1">
                            <TypographyBody className="font-semibold">
                                {t('quoteOfTheDay')}
                            </TypographyBody>
                            <TypographyParagraph className="text-sm text-muted-foreground">
                                {t(`quotes.${quoteKey}.title`)}
                            </TypographyParagraph>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-center gap-2 border-t px-6 text-center">
                    <ArrowUpLeft
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <TypographyBody className="text-xs text-muted-foreground sm:text-sm">
                        {t('navigationHint')}
                    </TypographyBody>
                </CardFooter>
            </Card>
            {links.length > 0 && (
                <nav
                    aria-label={t('linksLabel')}
                    className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
                >
                    {links.map((link) => (
                        <Link
                            key={link.url}
                            href={link.url}
                            className="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <TypographyBody className="text-sm">
                                {tNavigation(link.name)}
                            </TypographyBody>
                        </Link>
                    ))}
                </nav>
            )}
        </section>
    );
}
