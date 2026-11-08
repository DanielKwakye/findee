export type NotificationEmailContent = {
    brand: string;
    title: string;
    introduction: string;
    highlight?: string;
    guidance: string;
    link?: { href: string; label: string };
    signoff: string;
    footer: string;
    footerTagline?: string;
    footerDescription?: string;
};
