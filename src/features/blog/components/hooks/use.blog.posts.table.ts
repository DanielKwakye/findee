"use client";

import { useMemo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { usePortalTableSearch, useUserDateTime, type PortalTablePaginationState } from "@/components/platform";
import { getAdminPosts } from "@/features/blog/server/get.admin.posts.action";
import { getBlogPostColumns } from "@/features/blog/utils/blog.columns";
import type { BlogPostDialogHandle, BlogPostRow } from "@/features/blog/utils/blog.types";

/** Manages administrator story listings, pagination, and editor access. */
export function useBlogPostsTable() {
    const t = useTranslations("Blog.admin");
    const formatDate = useUserDateTime();
    const editorRef = useRef<BlogPostDialogHandle>(null);
    const [pagination, setPagination] = useState<PortalTablePaginationState>({ page: 1, pageSize: 10 });
    const { search, setSearch, debouncedSearch } = usePortalTableSearch(setPagination);
    const query = useQuery({
        queryKey: ["blog", "admin", "posts", pagination, debouncedSearch],
        queryFn: () => getAdminPosts({ ...pagination, search: debouncedSearch }),
        placeholderData: keepPreviousData,
    });
    const columns = useMemo(() => getBlogPostColumns(t, formatDate), [t, formatDate]);

    /** Opens a story for editing. */
    function editPost(post: BlogPostRow) { editorRef.current?.open(post.id); }

    return { t, query, editorRef, columns, search, setSearch, setPagination, editPost,
        pagination: { ...pagination, page: query.isPlaceholderData ? pagination.page : query.data?.page ?? pagination.page, total: query.data?.total ?? 0 } };
}
