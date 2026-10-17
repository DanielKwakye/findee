import type { BlogPost } from "@/generated/client";
import type { JSONContent } from "@tiptap/core";

export type BlogStory = Pick<BlogPost,
    "id" | "slug" | "title" | "excerpt" | "coverImageUrl" | "author" | "tags" | "featured" | "publishedAt" | "createdAt"
>;

export type BlogPostRow = Pick<BlogPost, "id" | "title" | "author" | "published" | "featured" | "createdAt" | "publishedAt">;
export type BlogPostValues = {
    title: string;
    slug: string;
    excerpt: string;
    content: JSONContent;
    coverImageUrl: string;
    author: string;
    tags: string;
    featured: boolean;
    published: boolean;
};
export type BlogPostQuery = { page: number; pageSize: number; search: string };
export type BlogPostDialogHandle = { open: (id?: string) => void };
