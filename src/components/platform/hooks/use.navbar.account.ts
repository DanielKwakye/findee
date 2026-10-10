"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getAuthSession } from "@/features/auth/server/get.auth.session";
import { useLogout } from "@/features/auth/components/hooks/use.logout";

/** Manages the navigation account action and session status. */
export function useNavbarAccount() {
    const t = useTranslations("Auth");
    const session = useQuery({ queryKey: ["auth", "session"], queryFn: getAuthSession });
    const logout = useLogout();
    return { t, isAuthenticated: session.data?.isAuthenticated ?? false, session, logout };
}
