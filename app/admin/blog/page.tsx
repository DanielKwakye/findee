import { BlogPostsTable } from "@/features/blog/components/ui/blog-posts-table";
import type { Metadata } from "next";
import messages from "@/translations/en.json";

export const metadata: Metadata = { title: messages.PageMetadata.titles.adminBlog };

/** Presents story management in the administrator dashboard. */
export default function AdminBlogPage() {
    return <BlogPostsTable />;
}
