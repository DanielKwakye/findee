"use client";

import { CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/core/ui/avatar";
import TypographyBody from "@/components/core/ui/typography-body";
import { useUserDateTime } from "@/components/platform";
import type { BlogStory } from "@/features/blog/utils/blog.types";

/** Displays a story's author and publication date in the reader's timezone. */
export function BlogStoryAuthor({ story }: { story: Pick<BlogStory, "author" | "publishedAt" | "createdAt"> }) {
    const formatDate = useUserDateTime();
    const date = story.publishedAt ?? story.createdAt;
    return (
        <>
            <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-primary"><TypographyBody className="text-xs font-semibold">{story.author.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase()}</TypographyBody></AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1">
                <TypographyBody className="block truncate text-sm font-medium">{story.author}</TypographyBody>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays aria-hidden="true" className="size-3.5 shrink-0" />
                    <time dateTime={date.toISOString()}><TypographyBody className="text-xs">{formatDate(date)}</TypographyBody></time>
                </div>
            </div>
        </>
    );
}
