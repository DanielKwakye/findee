import type { ShareLinks } from '@/components/platform/utils/share';

const defaultLink =
    process.env.NEXT_PUBLIC_DEFAULT_UTM_LINK || process.env.APP_URL || 'https://findmus.com/';

export const shareLinks: ShareLinks = {
    default: defaultLink,
    x: process.env.NEXT_PUBLIC_TWITTER_UTM_LINK || defaultLink,
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_UTM_LINK || defaultLink,
    instagram: process.env.NEXT_PUBLIC_IG_UTM_LINK || defaultLink,
    facebook: process.env.NEXT_PUBLIC_FB_UTM_LINK || defaultLink,
};
