'use client';

import { useRef } from 'react';
import type { FeatureRequestDialogHandle } from '@/features/tickets/utils/ticket.types';

/** Manages customer sidebar dialog interactions. */
export function usePortalSidebar() {
    const featureRequestRef = useRef<FeatureRequestDialogHandle>(null);
    /** Opens the customer's feature request form. */
    function requestFeature() {
        featureRequestRef.current?.open();
    }
    return { featureRequestRef, requestFeature };
}
