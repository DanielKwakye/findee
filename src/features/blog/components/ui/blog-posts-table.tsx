"use client";

import { Plus } from "lucide-react";
import { PortalTable } from "@/components/platform";
import { Button } from "@/components/core/ui/button";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useBlogPostsTable } from "@/features/blog/components/hooks/use.blog.posts.table";
import { BlogPostDialog } from "@/features/blog/components/ui/blog-post-dialog";

/** Presents searchable story management with an editor for drafts and published posts. */
export function BlogPostsTable() {
    const { t, query, editorRef, columns, search, setSearch, pagination, setPagination, editPost } = useBlogPostsTable();
    return (
        <section aria-label={t("title")} className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <TypographyH1 className="text-2xl tracking-tight">{t("title")}</TypographyH1>
                    <TypographyParagraph className="text-sm text-muted-foreground">{t("description")}</TypographyParagraph>
                </div>
                <Button type="button" onClick={() => editorRef.current?.open()}><Plus aria-hidden="true" /><TypographyBody className="text-sm">{t("createPost")}</TypographyBody></Button>
            </div>
            {query.isError && <div role="alert" className="flex flex-wrap items-center gap-3">
                <TypographyBody className="text-sm text-destructive">{t("loadError")}</TypographyBody>
                <Button type="button" variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
            </div>}
            <PortalTable data={query.data?.posts ?? []} columns={columns} pagination={pagination} onPaginationChange={setPagination}
                search={search} onSearchChange={setSearch} isLoading={query.isLoading} onRowClick={editPost} />
            <BlogPostDialog ref={editorRef} />
        </section>
    );
}
