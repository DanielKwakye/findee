import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import messages from '@/translations/en.json';
import { Footer, InnerPageHero, MobileNavbar, WebNavbar } from '@/components/platform';
import TypographyBody from '@/components/core/ui/typography-body';
import { everydayItems } from '@/features/use-cases/data/everyday.items';

export const metadata: Metadata = { title: messages.PageMetadata.titles.everydayItems };

/** Lists everyday belongings suitable for vinyl QR stickers. */
export default function EverydayItemsPage() {
    const t = useTranslations('EverydayItems');
    return (
        <>
            <MobileNavbar appearance="solid" />
            <WebNavbar appearance="solid" showGetStarted={false} />
            <main className="min-h-screen bg-background pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] xl:pb-0">
                <InnerPageHero
                    title={t('title')}
                    titleAccent={t('titleAccent')}
                    subtitle={t('subtitle')}
                />
                <section
                    aria-label={t('listLabel')}
                    className="container mx-auto max-w-6xl px-5 pt-6 pb-12 sm:px-6 sm:pb-16"
                >
                    <ul className="grid list-inside list-disc grid-cols-1 gap-x-8 gap-y-4 marker:text-primary sm:grid-cols-2 lg:grid-cols-4">
                        {everydayItems.map((item) => (
                            <li key={item}>
                                <TypographyBody className="text-sm">
                                    {t(`items.${item}`)}
                                </TypographyBody>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
            <Footer />
        </>
    );
}
