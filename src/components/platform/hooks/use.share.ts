'use client';

import { useRef } from 'react';
import type { ShareDialogHandle, ShareLinks } from '@/components/platform/utils/share';
import { trackEvent } from '@/lib/firebase';

/** Manages opening the footer's reusable sharing dialog. */
export function useShare(links?: ShareLinks) {
    const dialogRef = useRef<ShareDialogHandle>(null);

    /** Opens sharing with the website's configured campaign links. */
    function openShare() {
        if (links) {
            void trackEvent('share_dialog_opened', { page_path: window.location.pathname });
            dialogRef.current?.open(links);
        }
    }

    /** Records visits to social profiles from the website or customer portal. */
    function onSocialClick(platform: string, source: 'footer' | 'customer_sidebar') {
        void trackEvent('social_link_clicked', {
            platform,
            source,
            page_path: window.location.pathname,
        });
    }

    return { dialogRef, openShare, onSocialClick };
}
