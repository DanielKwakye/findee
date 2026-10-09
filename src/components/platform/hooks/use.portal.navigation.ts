"use client";

import {usePathname} from "next/navigation";

/** Manages sidebar route matching for the current portal location. */
export function usePortalNavigation() {
    const pathname = usePathname();

    /** Identifies navigation links belonging to the current route or its parent section. */
    function isActive(url: string) {
        return url.startsWith("/") && (pathname === url || (url !== "/" && pathname.startsWith(`${url}/`)));
    }

    return {isActive};
}
