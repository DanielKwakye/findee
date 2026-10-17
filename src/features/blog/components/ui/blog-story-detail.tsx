import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import type { JSONContent } from "@tiptap/core";
import { Button } from "@/components/core/ui/button";
import { Badge } from "@/components/core/ui/badge";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { BlogStoryAuthor } from "@/features/blog/components/ui/blog-story-author";
import { BlogStoryContent } from "@/features/blog/components/ui/blog-story-content";
import type { getBlogStory } from "@/features/blog/server/get.blog.story.action";

/** Presents a published story with its cover, author details, and complete rich text body. */
export function BlogStoryDetail({ story }: { story: NonNullable<Awaited<ReturnType<typeof getBlogStory>>> }) {
    const t = useTranslations("Blog");
    return (
        <article className="container mx-auto max-w-4xl space-y-8 px-5 py-8 sm:px-6 sm:py-14">
            <Button variant="ghost" render={<Link href="/blog" />} nativeButton={false} className="-ms-3">
                <ArrowLeft aria-hidden="true" /><TypographyBody className="text-sm">{t("backToStories")}</TypographyBody>
            </Button>
            <header className="space-y-5">
                {(story.featured || story.tags.length > 0) && <div className="flex flex-wrap gap-2">
                    {story.featured && <Badge><TypographyBody className="text-xs">{t("featuredBadge")}</TypographyBody></Badge>}
                    {story.tags.map(tag => <Badge key={tag} variant="outline"><TypographyBody className="text-xs">{tag}</TypographyBody></Badge>)}
                </div>}
                <TypographyH1 className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">{story.title}</TypographyH1>
                <TypographyParagraph className="text-lg text-muted-foreground">{story.excerpt}</TypographyParagraph>
                <div className="flex items-center gap-3"><BlogStoryAuthor story={story} /></div>
            </header>
            <div className="relative isolate flex aspect-[16/9] items-center overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10">
                {story.coverImageUrl ? <Image src={story.coverImageUrl} alt={story.title} fill sizes="(min-width: 896px) 848px, 100vw" className="object-cover" preload />
                    : <>
                        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-br from-foreground/85 via-foreground/60 to-transparent" />
                        <TypographyBody className="line-clamp-4 font-heading text-2xl leading-tight font-semibold tracking-tight sm:text-4xl">{story.title}</TypographyBody>
                    </>}
            </div>
            <BlogStoryContent content={story.content as JSONContent} />
        </article>
    );
}
