"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/core/ui/card";
import { Badge } from "@/components/core/ui/badge";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { BlogStoryAuthor } from "@/features/blog/components/ui/blog-story-author";
import type { BlogStory } from "@/features/blog/utils/blog.types";
import { cn } from "@/lib/utils";

/** Presents a story's cover, manually written excerpt, and publication details. */
export function BlogStoryCard({ story, compact = false }: { story: BlogStory; compact?: boolean }) {
    const t = useTranslations("Blog");
    return (
        <article className="min-w-0">
            <Link href={`/blog/${story.slug}`} aria-label={t("readStory", { title: story.title })} className="group block h-full rounded-2xl outline-none transition-[scale] duration-300 ease-in-out hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none motion-reduce:scale-100 motion-reduce:transition-none">
            <Card className="h-full gap-5 border border-border pt-0 ring-0 transition-shadow group-hover:shadow-[0_0_12px_2px_var(--tw-shadow-color)] group-hover:shadow-chart-2/10 group-focus-visible:shadow-[0_0_12px_2px_var(--tw-shadow-color)] group-focus-visible:shadow-chart-2/10">
                <div className="relative isolate flex aspect-[16/9] items-center overflow-hidden bg-primary px-6 py-12 text-primary-foreground sm:px-8">
                    {story.coverImageUrl ? (
                        <Image src={story.coverImageUrl} alt={story.title} fill sizes={compact ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"} className="object-cover" />
                    ) : (
                        <>
                            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-br from-foreground/85 via-foreground/60 to-transparent" />
                            <TypographyBody className={cn("line-clamp-4 font-heading leading-tight font-semibold tracking-tight", compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl lg:text-4xl")}>{story.title}</TypographyBody>
                        </>
                    )}
                    {story.featured && <Badge className="absolute top-4 left-4 h-auto px-3 py-1 shadow-sm"><TypographyBody className="text-xs font-semibold uppercase">{t("featuredBadge")}</TypographyBody></Badge>}
                </div>
                <CardContent className="space-y-3">
                    {story.tags.length > 0 && <div className="flex flex-wrap gap-2">
                        {story.tags.map(tag => <Badge key={tag} variant="outline"><TypographyBody className="text-xs">{tag}</TypographyBody></Badge>)}
                    </div>}
                    <h3><TypographyBody className={cn("font-heading leading-snug font-semibold tracking-tight group-hover:text-primary", compact ? "line-clamp-2 text-lg sm:text-xl" : "text-xl sm:text-2xl")}>{story.title}</TypographyBody></h3>
                    <TypographyParagraph className={cn("text-sm leading-6 text-muted-foreground", compact ? "line-clamp-2" : "line-clamp-3")}>{story.excerpt}</TypographyParagraph>
                </CardContent>
                <CardFooter className="mt-auto gap-3">
                    <BlogStoryAuthor story={story} />
                </CardFooter>
            </Card>
            </Link>
        </article>
    );
}
