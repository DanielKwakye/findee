'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/core/ui/button';
import TypographyBody from '@/components/core/ui/typography-body';
import { openCookiePreferences } from '@/components/platform/utils/cookie.notice';

/** Provides footer access to the shared cookie preferences notice. */
export default function FooterCookiePreferences() {
    const t = useTranslations('CookieNotice');

    return (
        <Button
            type="button"
            variant="link"
            onClick={openCookiePreferences}
            className="h-auto p-0 text-primary-foreground/70 transition-colors hover:text-primary-foreground hover:no-underline"
        >
            <TypographyBody className="text-sm">{t('preferences')}</TypographyBody>
        </Button>
    );
}
