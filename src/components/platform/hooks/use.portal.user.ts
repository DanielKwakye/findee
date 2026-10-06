"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "@/components/core/ui/sidebar";
import { useLogout } from "@/features/auth/components/hooks/use.logout";

/** Manages the portal account menu's layout and authentication behavior. */
export function usePortalUser() {
    const { isMobile } = useSidebar();
    const logout = useLogout();
    const t = useTranslations("Auth");
    return { isMobile, logout, t };
}
