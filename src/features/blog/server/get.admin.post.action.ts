"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { validateBlogId } from "@/features/blog/utils/blog.validation";

/** Retrieves a story's editable fields for an authenticated administrator. */
export async function getAdminPost(id: string) {
    await requireAdmin();
    validateBlogId(id);
    const post = await db.blogPost.findUnique({
        where: { id },
        select: { id: true, title: true, slug: true, excerpt: true, content: true, coverImageUrl: true,
            author: true, tags: true, featured: true, published: true },
    });
    if (!post) throw new Error("postNotFound");
    return post;
}
