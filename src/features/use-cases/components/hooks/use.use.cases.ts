'use client';

import { useSyncExternalStore } from 'react';
import { trackEvent } from '@/lib/analytics';

/** Subscribes to the use cases layout breakpoint. */
function subscribe(notify: () => void) {
    const query = window.matchMedia('(min-width: 1024px)');
    query.addEventListener('change', notify);
    return () => query.removeEventListener('change', notify);
}

/** Reads the number of cards that fit on a use cases page. */
function getPageSize() {
    return window.matchMedia('(min-width: 1024px)').matches ? 9 : 1;
}

/** Provides the mobile layout during server rendering. */
function getServerPageSize() {
    return 1;
}

/** Manages the responsive layout of the use cases carousel. */
export function useUseCases() {
    const pageSize = useSyncExternalStore(subscribe, getPageSize, getServerPageSize);

    /** Reports deliberate interest in a sticker category. */
    function onVariantChange(variant: string) {
        void trackEvent('variant_selected', { variant, source: 'use_cases' });
    }

    /** Reports the belonging and sticker category a visitor chooses to explore. */
    function onUseCaseClick(useCase: string, variant: string) {
        void trackEvent('use_case_clicked', { use_case: useCase, variant, source: 'use_cases' });
    }

    return { pageSize, onVariantChange, onUseCaseClick };
}
