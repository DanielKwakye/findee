export type SharePlatform = 'x' | 'tiktok' | 'instagram' | 'facebook';
export type ShareLinks = Record<SharePlatform | 'default', string>;
export type ShareDialogHandle = { open: (links: ShareLinks) => void };

/** Builds the supported web composers for sharing a tracked link. */
export function getSocialShareUrl(platform: SharePlatform, url: string, text: string) {
    if (platform === 'x')
        return `https://twitter.com/intent/tweet?${new URLSearchParams({ url, text })}`;
    if (platform === 'facebook')
        return `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: url })}`;
    return null;
}
