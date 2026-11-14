'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { recordPortalVisit } from '@/features/auth/server/record.portal.visit.action';
import type { AuthRole } from '@/features/auth/utils/auth.types';

/** Tracks portal entry and navigation while limiting visit requests. */
export function usePortalVisit(role: AuthRole) {
    const pathname = usePathname();
    const lastAttemptAt = useRef(0);
    const { mutate } = useMutation({ mutationFn: recordPortalVisit, retry: false });
    useEffect(() => {
        const now = Date.now();
        if (now - lastAttemptAt.current < 5 * 60_000) return;
        lastAttemptAt.current = now;
        mutate(role);
    }, [pathname, mutate, role]);
}
