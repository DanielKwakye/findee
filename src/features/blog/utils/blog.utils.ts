import type { JSONContent } from "@tiptap/core";

/** Creates a readable URL segment from a story title. */
export function getBlogSlug(title: string) {
    return title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 160).replace(/-$/, "");
}

/** Restricts story cover URLs to the image host configured for optimization. */
export function isBlogCoverUrl(value: string) {
    return !value.trim() || getBlogContentImageUrl(value) !== null;
}

/** Allows ordinary web links in story content. */
export function isBlogLink(value: string) {
    try {
        const url = new URL(value);
        return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
    } catch { return false; }
}

/** Identifies image links supported by the website's image optimization configuration. */
export function getBlogContentImageUrl(value: string) {
    if (!isBlogLink(value)) return null;
    let url = new URL(value);
    if (url.protocol !== "https:" || url.port || url.hash) return null;
    if (url.hostname === "findmus.com" && url.pathname === "/_next/image") {
        const source = url.searchParams.get("url");
        if (!source) return null;
        try { url = new URL(source, url.origin); } catch { return null; }
    }
    if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash) return null;
    const cloudinary = url.hostname === "res.cloudinary.com" && url.pathname.startsWith("/ddnzrzwjx/image/upload/");
    const findmus = url.hostname === "findmus.com"
        && (url.pathname.startsWith("/images/") || url.pathname.startsWith("/_next/static/media/"))
        && /\.(png|jpe?g|webp|avif|gif)$/i.test(url.pathname);
    return cloudinary || findmus ? url.href : null;
}

/** Checks whether a rich text document contains written content. */
export function hasBlogContent(content: JSONContent): boolean {
    return !!content.text?.trim() || !!content.content?.some(hasBlogContent);
}
