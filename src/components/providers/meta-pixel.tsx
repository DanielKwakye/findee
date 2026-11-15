'use client';

import Script from 'next/script';
import { useMetaPixel } from '@/components/providers/use.meta.pixel';

/** Loads Meta's browser library when advertising collection is permitted. */
export function MetaPixel() {
    const enabled = useMetaPixel();
    if (!enabled) return null;
    return (
        <Script
            id="meta-pixel"
            src="https://connect.facebook.net/en_US/fbevents.js"
            strategy="afterInteractive"
        />
    );
}
