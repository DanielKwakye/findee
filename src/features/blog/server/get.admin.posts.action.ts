"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import type { BlogPostQuery } from "@/features/blog/utils/blog.types";
import { validateBlogQuery } from "@/features/blog/utils/blog.validation";

/** Lists administrator story summaries, including drafts, newest first. */
export async function getAdminPosts(params: BlogPostQuery) {
    await requireAdmin();
    const { page: requestedPage, pageSize, search } = validateBlogQuery(params);
    const where = search ? { title: { contains: search, mode: "insensitive" as const } } : {};
    const total = await db.blogPost.count({ where });
    const page = Math.min(requestedPage, Math.max(1, Math.ceil(total / pageSize)));
    const posts = await db.blogPost.findMany({
        where, skip: (page - 1) * pageSize, take: pageSize,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: { id: true, title: true, author: true, published: true, featured: true, createdAt: true, publishedAt: true },
    });
    return { posts, total, page };
}
