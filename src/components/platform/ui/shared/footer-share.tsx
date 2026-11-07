'use client';

import { Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/core/ui/button';
import ShareDialog from '@/components/platform/ui/shared/share-dialog';
import { useShare } from '@/components/platform/hooks/use.share';
import type { ShareLinks } from '@/components/platform/utils/share';

/** Opens the shared website sharing dialog from the footer. */
export default function FooterShare({ links }: { links: ShareLinks }) {
    const t = useTranslations('Footer');
    const { dialogRef, openShare } = useShare(links);
    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t('social.share')}
                onClick={openShare}
                className="size-7 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
                <Share2 aria-hidden="true" className="size-6" />
            </Button>
            <ShareDialog ref={dialogRef} />
        </>
    );
}
