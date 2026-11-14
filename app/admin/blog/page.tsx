import { BlogPostsTable } from '@/features/blog/components/ui/blog-posts-table';
import type { Metadata } from 'next';
import messages from '@/translations/en.json';
import { requireAdmin } from '@/features/auth/server/auth.session';
import { UserDepartments } from '@/features/users/utils/users.constants';

export const metadata: Metadata = { title: messages.PageMetadata.titles.adminBlog };

/** Presents story management in the administrator dashboard. */
export default async function AdminBlogPage() {
    await requireAdmin({ department: UserDepartments.marketing });
    return <BlogPostsTable />;
}
