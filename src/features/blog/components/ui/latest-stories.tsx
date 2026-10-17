"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/core/ui/button";
import { Skeleton } from "@/components/core/ui/skeleton";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { BlogStoryCard } from "@/features/blog/components/ui/blog-story-card";
import { useLatestStories } from "@/features/blog/components/hooks/use.latest.stories";

/** Presents the paginated latest articles beneath the featured stories. */
export function LatestStories() {
    const t = useTranslations("Blog");
    const { query, page, pageCount, setPage } = useLatestStories();
    return (
        <section aria-labelledby="latest-stories-heading" aria-busy={query.isFetching} className="container mx-auto space-y-7 px-5 pt-6 pb-12 sm:px-6 sm:pb-16">
            <h2 id="latest-stories-heading" className="border-s-4 border-primary ps-4"><TypographyBody className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{t("latestArticles")}</TypographyBody></h2>
            {query.isPending ? (
                <div role="status" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <TypographyBody className="sr-only">{t("loading")}</TypographyBody>
                    {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-104 w-full rounded-2xl" />)}
                </div>
            ) : query.isError ? (
                <div role="alert" className="space-y-4 rounded-2xl border border-border p-6">
                    <TypographyParagraph className="text-sm text-muted-foreground">{t("loadError")}</TypographyParagraph>
                    <Button type="button" variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
                </div>
            ) : query.data.stories.length === 0 ? (
                <TypographyParagraph className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">{t("noLatestStories")}</TypographyParagraph>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{query.data.stories.map(story => <BlogStoryCard key={story.id} story={story} compact />)}</div>
                    {pageCount > 1 && <nav aria-label={t("pagination")} className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                        <Button type="button" variant="outline" disabled={query.isFetching || page <= 1} onClick={() => setPage(page - 1)}>
                            <ChevronLeft aria-hidden="true" /><TypographyBody className="text-sm">{t("previousPage")}</TypographyBody>
                        </Button>
                        <div aria-live="polite" aria-atomic="true"><TypographyBody className="text-sm text-muted-foreground">{t("pageNumber", { page, total: pageCount })}</TypographyBody></div>
                        <Button type="button" variant="outline" disabled={query.isFetching || page >= pageCount} onClick={() => setPage(page + 1)}>
                            <TypographyBody className="text-sm">{t("nextPage")}</TypographyBody><ChevronRight aria-hidden="true" />
                        </Button>
                    </nav>}
                </>
            )}
        </section>
    );
}
