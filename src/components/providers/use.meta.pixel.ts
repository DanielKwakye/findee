'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import {
    hasAdvertisingConsent,
    subscribeCookieNotice,
    getServerAdvertisingConsent,
} from '@/components/platform/utils/cookie.notice';
import { canTrackMetaPixel, syncMetaPixel, trackMetaEvent } from '@/lib/meta.pixel';

/** Manages advertising permission and page tracking across client navigation. */
export function useMetaPixel() {
    const pathname = usePathname();
    const consent = useSyncExternalStore(
        subscribeCookieNotice,
        hasAdvertisingConsent,
        getServerAdvertisingConsent,
    );
    useEffect(() => {
        syncMetaPixel();
        trackMetaEvent('page_view');
    }, [pathname, consent]);
    return consent && canTrackMetaPixel();
}
