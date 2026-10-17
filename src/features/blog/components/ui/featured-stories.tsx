"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/core/ui/button";
import { Skeleton } from "@/components/core/ui/skeleton";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useFeaturedStories } from "@/features/blog/components/hooks/use.featured.stories";
import { BlogStoryCard } from "@/features/blog/components/ui/blog-story-card";

/** Displays the published featured stories with loading, empty, and retry states. */
export function FeaturedStories() {
    const t = useTranslations("Blog");
    const query = useFeaturedStories();
    return (
        <section aria-labelledby="featured-stories-heading" className="container mx-auto space-y-7 px-5 pt-6 pb-12 sm:px-6 sm:pb-16" aria-busy={query.isPending}>
            <h2 id="featured-stories-heading" className="border-s-4 border-primary ps-4"><TypographyBody className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{t("featuredStories")}</TypographyBody></h2>
            {query.isPending ? (
                <div role="status" className="grid gap-6 lg:grid-cols-2">
                    <TypographyBody className="sr-only">{t("loading")}</TypographyBody>
                    <Skeleton className="h-112 w-full rounded-2xl" />
                    <Skeleton className="h-112 w-full rounded-2xl" />
                </div>
            ) : query.isError ? (
                <div role="alert" className="space-y-4 rounded-2xl border border-border p-6">
                    <TypographyParagraph className="text-sm text-muted-foreground">{t("loadError")}</TypographyParagraph>
                    <Button type="button" variant="outline" onClick={() => query.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
                </div>
            ) : query.data.length === 0 ? (
                <TypographyParagraph className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">{t("noFeaturedStories")}</TypographyParagraph>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">{query.data.map(story => <BlogStoryCard key={story.id} story={story} />)}</div>
            )}
        </section>
    );
}
