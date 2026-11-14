'use client';

import { usePortalVisit } from '@/features/auth/components/hooks/use.portal.visit';
import type { AuthRole } from '@/features/auth/utils/auth.types';

/** Records visits from the authenticated customer portal. */
export default function PortalVisitTracker({ role }: { role: AuthRole }) {
    usePortalVisit(role);
    return null;
}
