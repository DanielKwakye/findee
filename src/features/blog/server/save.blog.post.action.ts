"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/client";
import { validateBlogId, validateBlogValues } from "@/features/blog/utils/blog.validation";
import type { BlogPostValues } from "@/features/blog/utils/blog.types";

/** Creates or updates a story while preserving its original publication date. */
export async function saveBlogPost(values: BlogPostValues, id?: string) {
    await requireAdmin();
    if (id !== undefined) validateBlogId(id);
    const data = validateBlogValues(values);
    try {
        const existing = id ? await db.blogPost.findUniqueOrThrow({ where: { id }, select: { publishedAt: true } }) : null;
        const duplicate = await db.blogPost.findUnique({ where: { slug: data.slug }, select: { id: true } });
        if (duplicate && duplicate.id !== id) throw new Error("slugTaken");
        const publishedAt = existing?.publishedAt ?? (data.published ? new Date() : null);
        return id
            ? await db.blogPost.update({ where: { id }, data: { ...data, publishedAt }, select: { id: true } })
            : await db.blogPost.create({ data: { ...data, publishedAt }, select: { id: true } });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new Error("slugTaken");
        throw error;
    }
}
