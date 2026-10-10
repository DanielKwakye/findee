"use client";

import {usePathname, useSearchParams} from "next/navigation";

/** Manages sidebar route matching for the current portal location. */
export function usePortalNavigation() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /** Identifies navigation links belonging to the current route or its parent section. */
    function isActive(url: string, matchStatus = false) {
        const [path, query] = url.split("?");
        if (!path.startsWith("/") || (pathname !== path && (path === "/" || !pathname.startsWith(`${path}/`)))) return false;
        return !matchStatus && query === undefined
            || new URLSearchParams(query).get("status") === searchParams.get("status");
    }

    return {isActive};
}
