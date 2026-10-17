"use client";

import type { Ref } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/core/ui/dialog";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import { useBlogPostDialog } from "@/features/blog/components/hooks/use.blog.post.dialog";
import { BlogPostForm } from "@/features/blog/components/ui/blog-post-form";
import type { BlogPostDialogHandle } from "@/features/blog/utils/blog.types";

/** Presents an internally managed dialog for creating and editing stories. */
export function BlogPostDialog({ ref }: { ref: Ref<BlogPostDialogHandle> }) {
    const { t, request, query, mutation, changeOpen } = useBlogPostDialog(ref);
    const loading = !!request?.id && query.isFetching;
    return (
        <Dialog open={request !== null} onOpenChange={changeOpen}>
            <DialogContent showCloseButton={false} className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl" aria-busy={loading || mutation.isPending}>
                <DialogHeader className="pr-8">
                    <DialogTitle><TypographyBody className="font-medium">{t(request?.id ? "editPost" : "createPost")}</TypographyBody></DialogTitle>
                    <DialogDescription><TypographyBody className="text-sm text-muted-foreground">{t("editorDescription")}</TypographyBody></DialogDescription>
                </DialogHeader>
                <Button type="button" variant="ghost" size="icon-sm" aria-label={t("close")} className="absolute top-4 right-4" disabled={mutation.isPending} onClick={() => changeOpen(false)}><XIcon aria-hidden="true" /></Button>
                {request && (loading ? <div role="status"><TypographyBody className="text-sm">{t("loading")}</TypographyBody></div>
                    : request.id && query.isError ? <div role="alert" className="space-y-3">
                        <TypographyBody className="block text-sm text-destructive">{t("loadError")}</TypographyBody>
                        <Button type="button" variant="outline" onClick={() => query.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
                    </div> : (!request.id || query.data) && <BlogPostForm key={request.id ?? "new"} post={request.id ? query.data : undefined}
                        save={values => mutation.mutateAsync(values)} isPending={mutation.isPending} close={() => changeOpen(false)} />)}
            </DialogContent>
        </Dialog>
    );
}
