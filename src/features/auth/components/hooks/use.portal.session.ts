"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAuthSession } from "@/features/auth/server/get.auth.session";
import type { AuthRole } from "@/features/auth/utils/auth.types";

/** Rechecks portal access on navigation and tab return without periodic polling. */
export function usePortalSession(role: AuthRole) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const redirected = useRef(false);
    const { data, isSuccess, isFetching, refetch } = useQuery({
        queryKey: ["auth", "session"],
        queryFn: getAuthSession,
        staleTime: 0,
        retry: 1,
        refetchInterval: false,
        refetchOnWindowFocus: "always",
    });
    useEffect(() => {
        void refetch({ cancelRefetch: false });
    }, [pathname, searchParams, refetch]);
    useEffect(() => {
        if (!isSuccess || isFetching || redirected.current) return;
        if (!data.isAuthenticated || data.role !== role) {
            redirected.current = true;
            window.location.replace(role === "ADMIN" ? "/login" : "/sign-in");
        }
    }, [data, isSuccess, isFetching, role]);
}
