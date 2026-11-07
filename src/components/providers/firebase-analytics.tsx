'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getFirebaseAnalytics } from '@/lib/firebase';

/** Starts automatic Analytics collection for the current browser session. */
export function FirebaseAnalytics() {
    const pathname = usePathname();
    useEffect(() => {
        void getFirebaseAnalytics();
    }, [pathname]);

    return null;
}
