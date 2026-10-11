"use client";

import {useEffect, useState} from "react";
import type {Dispatch, SetStateAction} from "react";
import type {PortalTablePaginationState} from "@/components/platform/utils/portal.table.types";

/** Manages table search input and applies server filtering after typing pauses. */
export function usePortalTableSearch(setPagination: Dispatch<SetStateAction<PortalTablePaginationState>>) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        if (search === debouncedSearch) return;
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination(current => ({...current, page: 1}));
        }, 350);
        return () => clearTimeout(timeout);
    }, [search, debouncedSearch, setPagination]);

    return {search, setSearch, debouncedSearch};
}
