"use server";

import { db } from "@/lib/db";
import type { BlogStory } from "@/features/blog/utils/blog.types";

/** Retrieves published featured stories in publication order without exposing draft content. */
export async function getFeaturedStories(): Promise<BlogStory[]> {
    return db.blogPost.findMany({
        where: { published: true, featured: true },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }, { id: "desc" }],
        select: {
            id: true, slug: true, title: true, excerpt: true, coverImageUrl: true,
            author: true, tags: true, featured: true, publishedAt: true, createdAt: true,
        },
    });
}
