"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLatestStories } from "@/features/blog/server/get.latest.stories.action";

/** Manages the latest articles and their server-side pagination. */
export function useLatestStories() {
    const [requestedPage, setPage] = useState(1);
    const query = useQuery({
        queryKey: ["blog", "latest", requestedPage],
        queryFn: () => getLatestStories(requestedPage),
        placeholderData: keepPreviousData,
    });
    return { query, setPage, page: query.data?.page ?? requestedPage, pageCount: query.data?.pageCount ?? 1 };
}
