"use client";

import { useImperativeHandle, useState, type Ref } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "@/components/core/ui/toast";
import { getAdminPost } from "@/features/blog/server/get.admin.post.action";
import { saveBlogPost } from "@/features/blog/server/save.blog.post.action";
import type { BlogPostDialogHandle, BlogPostValues } from "@/features/blog/utils/blog.types";

/** Manages the story editor's internal lifecycle, data loading, and saving. */
export function useBlogPostDialog(ref: Ref<BlogPostDialogHandle>) {
    const t = useTranslations("Blog.admin");
    const [request, setRequest] = useState<{ id?: string } | null>(null);
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["blog", "admin", "post", request?.id],
        queryFn: () => getAdminPost(request!.id!), enabled: !!request?.id,
        gcTime: 0, refetchOnWindowFocus: false, refetchOnReconnect: false,
    });
    const mutation = useMutation({
        // ProseMirror attributes use null-prototype objects, which server actions cannot read directly.
        mutationFn: (values: BlogPostValues) => saveBlogPost({
            ...values, content: JSON.parse(JSON.stringify(values.content)),
        }, request?.id), retry: false,
        /** Refreshes the story lists and leaves the editor after saving. */
        async onSuccess() {
            setRequest(null);
            toast.add({ title: t("saved"), type: "success" });
            await queryClient.invalidateQueries({ queryKey: ["blog"] });
        },
    });
    useImperativeHandle(ref, () => ({
        /** Opens an existing story or starts a new draft. */
        open(id) {
            if (mutation.isPending) return;
            mutation.reset();
            setRequest({ id });
        },
    }));

    /** Dismisses the editor while no save is running. */
    function changeOpen(open: boolean) { if (!open && !mutation.isPending) setRequest(null); }

    return { t, request, query, mutation, changeOpen };
}
