"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";

/** Retrieves unique saved story tags for administrators to reuse. */
export async function getBlogTags() {
    await requireAdmin();
    const posts = await db.blogPost.findMany({ select: { tags: true } });
    return [...new Set(posts.flatMap(post => post.tags).map(tag => tag.trim()).filter(Boolean))]
        .sort((first, second) => first.localeCompare(second));
}
