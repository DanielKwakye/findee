'use client';

import { useRef } from 'react';
import type { ShareDialogHandle, ShareLinks } from '@/components/platform/utils/share';

/** Manages opening the footer's reusable sharing dialog. */
export function useShare(links?: ShareLinks) {
    const dialogRef = useRef<ShareDialogHandle>(null);

    /** Opens sharing with the website's configured campaign links. */
    function openShare() {
        if (links) dialogRef.current?.open(links);
    }

    return { dialogRef, openShare };
}
