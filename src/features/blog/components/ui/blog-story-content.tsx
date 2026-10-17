import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { JSONContent } from "@tiptap/core";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { blogEditorExtensions } from "@/features/blog/data/blog.editor";
import { getBlogContentImageUrl, isBlogLink } from "@/features/blog/utils/blog.utils";
import styles from "@/features/blog/components/ui/blog-story-content.module.css";

/** Renders saved rich text as readable content using the editor's document schema. */
export function BlogStoryContent({ content }: { content: JSONContent }) {
    const t = useTranslations("Blog");
    return (
        <div className={styles.content}>
            {renderToReactElement({
                extensions: blogEditorExtensions, content,
                options: {
                    nodeMapping: {
                        paragraph: ({ children }) => <TypographyParagraph>{children}</TypographyParagraph>,
                        heading: ({ node, children }) => node.attrs.level === 3
                            ? <h3><TypographyBody className="font-heading text-xl leading-snug font-semibold sm:text-2xl">{children}</TypographyBody></h3>
                            : <h2><TypographyBody className="font-heading text-2xl leading-snug font-semibold sm:text-3xl">{children}</TypographyBody></h2>,
                    },
                    markMapping: {
                        link: ({ mark, children }) => {
                            const href = mark.attrs.href;
                            if (typeof href !== "string" || !isBlogLink(href)) return <>{children}</>;
                            const imageUrl = getBlogContentImageUrl(href);
                            return imageUrl
                                ? <Link href={imageUrl} prefetch={false} className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                                    <Image src={imageUrl} alt={t("contentImage")} width={1200} height={800}
                                        sizes="(min-width: 896px) 848px, 100vw" className="my-5 h-auto w-full rounded-2xl" />
                                </Link>
                                : <Link href={href} prefetch={false} className="text-primary underline underline-offset-4 hover:text-primary/80">{children}</Link>;
                        },
                    },
                },
            })}
        </div>
    );
}
