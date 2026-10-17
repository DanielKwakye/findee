"use server";

import { db } from "@/lib/db";

/** Retrieves a published story for public reading without exposing drafts. */
export async function getBlogStory(slug: string) {
    if (typeof slug !== "string" || slug.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
    return db.blogPost.findFirst({
        where: { slug, published: true },
        select: { title: true, excerpt: true, content: true, coverImageUrl: true, author: true,
            tags: true, featured: true, publishedAt: true, createdAt: true },
    });
}
