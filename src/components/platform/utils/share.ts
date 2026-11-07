export type SharePlatform = 'x' | 'facebook' | 'whatsapp';
export type ShareLinks = Record<'x' | 'tiktok' | 'instagram' | 'facebook' | 'default', string>;
export type ShareDialogHandle = { open: (links: ShareLinks) => void };

/** Builds the supported web composers for sharing a tracked link. */
export function getSocialShareUrl(platform: SharePlatform, url: string, text: string) {
    if (platform === 'x')
        return `https://twitter.com/intent/tweet?${new URLSearchParams({ url, text })}`;
    if (platform === 'facebook')
        return `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: url })}`;
    if (platform === 'whatsapp')
        return `https://wa.me/?${new URLSearchParams({ text: `${text}\n${url}` })}`;
    return null;
}
