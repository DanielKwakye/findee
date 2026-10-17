import "server-only";

import { getSchema } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
import type { Prisma } from "@/generated/client";
import type { BlogPostValues, BlogPostQuery } from "@/features/blog/utils/blog.types";
import { blogEditorExtensions } from "@/features/blog/data/blog.editor";
import { getBlogContentImageUrl, getBlogSlug, hasBlogContent, isBlogCoverUrl, isBlogLink } from "@/features/blog/utils/blog.utils";

/** Validates identifiers before accessing blog records. */
export function validateBlogId(id: string) {
    if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) throw new Error("invalidPost");
}

/** Bounds administrator listing requests. */
export function validateBlogQuery(params: BlogPostQuery) {
    if (!params || !Number.isSafeInteger(params.page) || params.page < 1
        || !Number.isSafeInteger(params.pageSize) || params.pageSize < 1 || params.pageSize > 100
        || typeof params.search !== "string") throw new Error("invalidPost");
    return { ...params, search: params.search.trim().slice(0, 200) };
}

/** Validates and normalizes a story and its rich text document before persistence. */
export function validateBlogValues(values: BlogPostValues) {
    if (!values || typeof values.title !== "string" || !values.title.trim() || values.title.length > 200
        || typeof values.slug !== "string" || typeof values.excerpt !== "string" || values.excerpt.length > 600
        || typeof values.author !== "string" || values.author.length > 100
        || typeof values.coverImageUrl !== "string" || values.coverImageUrl.length > 2000 || !isBlogCoverUrl(values.coverImageUrl)
        || typeof values.tags !== "string" || values.tags.length > 1000
        || typeof values.featured !== "boolean" || typeof values.published !== "boolean") throw new Error("invalidPost");
    const slug = values.slug.trim() || getBlogSlug(values.title);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 160) throw new Error("invalidPost");
    const tags = [...new Set(values.tags.split(",").map(tag => tag.trim()).filter(Boolean))];
    if (tags.length > 20 || tags.some(tag => tag.length > 50)) throw new Error("invalidPost");

    let content: Prisma.InputJsonValue;
    try {
        if (!values.content || values.content.type !== "doc" || JSON.stringify(values.content).length > 200_000) throw new Error();
        const stack = [{ node: values.content, depth: 0 }];
        let count = 0;
        while (stack.length) {
            const { node, depth } = stack.pop()!;
            if (++count > 5000 || depth > 20) throw new Error();
            for (const mark of node.marks ?? []) {
                if (mark.type === "link" && (typeof mark.attrs?.href !== "string" || !isBlogLink(mark.attrs.href))) throw new Error();
            }
            for (const child of node.content ?? []) stack.push({ node: child, depth: depth + 1 });
        }
        const document = Node.fromJSON(getSchema(blogEditorExtensions), values.content);
        document.check();
        content = document.toJSON() as Prisma.InputJsonValue;
    } catch { throw new Error("invalidContent"); }
    if (values.published && (!values.excerpt.trim() || !hasBlogContent(values.content))) throw new Error("publishIncomplete");
    return {
        title: values.title.trim(), slug, excerpt: values.excerpt.trim(), content,
        author: values.author.trim() || "Findmus Team", coverImageUrl: getBlogContentImageUrl(values.coverImageUrl),
        tags, featured: values.featured, published: values.published,
    };
}
