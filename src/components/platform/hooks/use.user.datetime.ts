"use client";

import {useCallback, useSyncExternalStore} from "react";
import {useFormatter} from "next-intl";
import {formatUserDateTime} from "@/lib/datetime";

/** Supplies a shared display formatter using the browser timezone after hydration. */
export function useUserDateTime() {
    const formatter = useFormatter();
    const timeZone = useSyncExternalStore(
        () => () => {},
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
        () => "UTC",
    );
    return useCallback((date: Date | number) => formatUserDateTime(date, formatter, timeZone), [formatter, timeZone]);
}
