export const footerLinkGroups = [
    {
        key: 'product',
        links: [
            { key: 'howItWorks', href: '/#how-it-works' },
            { key: 'stickers', href: '/checkout' },
            { key: 'pricing', href: '/pricing' },
            { key: 'faqs', href: '/#faq' },
        ],
    },
    {
        key: 'company',
        links: [
            { key: 'about', href: '/about' },
            { key: 'blog', href: '/blog' },
            { key: 'tickets', href: '/tickets' },
            { key: 'privacy', href: '/privacy' },
            { key: 'terms', href: '/terms' },
        ],
    },
] as const;

export const shareSocialOptions = [
    { key: 'facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z' },
    { key: 'x', path: 'M4 3h4l12 18h-4L4 3ZM20 3l-7 8M4 21l7-8' },
    {
        key: 'whatsapp',
        path: 'M21 11.5a9 9 0 0 1-13.4 7.8L3 21l1.7-4.6A9 9 0 1 1 21 11.5ZM8 7c0 5 4 9 9 9l1-3-3-1-1 1a8 8 0 0 1-3-3l1-1-1-3-3 1Z',
    },
] as const;

export const customerAccountLinks = [...footerLinkGroups[0].links, ...footerLinkGroups[1].links]
    .filter((link) => ['faqs', 'about', 'privacy', 'terms'].includes(link.key))
    .map((link) => ({ ...link, href: link.key === 'tickets' ? '/customer/tickets' : link.href }));

export const footerSocialLinks = [
    {
        key: 'x',
        href: process.env.NEXT_PUBLIC_TWITTER_PAGE_LINK || '#',
        path: 'M4 3h4l12 18h-4L4 3ZM20 3l-7 8M4 21l7-8',
    },
    {
        key: 'tiktok',
        href: process.env.NEXT_PUBLIC_TIKTOK_PAGE_LINK || '#',
        path: 'M14 3h3a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.75V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V3Z',
    },
    {
        key: 'instagram',
        href: process.env.NEXT_PUBLIC_IG_PAGE_LINK || '#',
        path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17.5 6.5h.01',
    },
    {
        key: 'facebook',
        href: process.env.NEXT_PUBLIC_FB_PAGE_LINK || '#',
        path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z',
    },
] as const;
