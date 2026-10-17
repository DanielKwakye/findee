"use server";

import { db } from "@/lib/db";

/** Retrieves a page of published, non-featured stories in publication order. */
export async function getLatestStories(requestedPage = 1) {
    if (!Number.isSafeInteger(requestedPage) || requestedPage < 1) throw new Error("invalidPage");
    const pageSize = 6;
    const where = { published: true, featured: false };
    const total = await db.blogPost.count({ where });
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(requestedPage, pageCount);
    const stories = await db.blogPost.findMany({
        where, skip: (page - 1) * pageSize, take: pageSize,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }, { id: "desc" }],
        select: {
            id: true, slug: true, title: true, excerpt: true, coverImageUrl: true,
            author: true, tags: true, featured: true, publishedAt: true, createdAt: true,
        },
    });
    return { stories, total, page, pageCount };
}
