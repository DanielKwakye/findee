"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeaturedStories } from "@/features/blog/server/get.featured.stories.action";

/** Manages the public featured stories and their loading and retry behavior. */
export function useFeaturedStories() {
    return useQuery({ queryKey: ["blog", "featured"], queryFn: getFeaturedStories });
}
