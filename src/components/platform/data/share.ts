import type { ShareLinks } from '@/components/platform/utils/share';

const defaultLink = process.env.DEFAULT_UTM_LINK || process.env.APP_URL || 'https://findmus.com/';

export const shareLinks: ShareLinks = {
    default: defaultLink,
    x: process.env.TWITTER_UTM_LINK || defaultLink,
    tiktok: process.env.TIKTOK_UTM_LINK || defaultLink,
    instagram: process.env.IG_UTM_LINK || defaultLink,
    facebook: process.env.FB_UTM_LINK || defaultLink,
};
