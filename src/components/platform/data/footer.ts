export const footerLinkGroups = [
  {
    key: "product",
    links: [
      { key: "howItWorks", href: "/#how-it-works" },
      { key: "stickers", href: "/checkout" },
      { key: "pricing", href: "/checkout" },
      { key: "faqs", href: "/#faq" },
    ],
  },
  {
    key: "company",
    links: [
      { key: "about", href: "#" },
      { key: "blog", href: "#" },
      { key: "contact", href: "#" },
      { key: "privacy", href: "#" },
      { key: "terms", href: "#" },
    ],
  },
] as const;

export const footerSocialLinks = [
  { key: "x", href: "#", path: "M4 3h4l12 18h-4L4 3ZM20 3l-7 8M4 21l7-8" },
  { key: "facebook", href: "#", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" },
  { key: "instagram", href: "#", path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17.5 6.5h.01" },
  { key: "youtube", href: "#", path: "M5 5h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3ZM10 8l6 4-6 4Z" },
] as const;
