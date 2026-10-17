"use client";

import { usePortalSession } from "@/features/auth/components/hooks/use.portal.session";
import type { AuthRole } from "@/features/auth/utils/auth.types";

/** Keeps an open protected page aligned with current session access. */
export default function PortalSessionGuard({ role }: { role: AuthRole }) {
    usePortalSession(role);
    return null;
}
