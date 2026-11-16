import type { EventParams } from 'firebase/analytics';
import { hasAdvertisingConsent } from '@/components/platform/utils/cookie.notice';

type Pixel = ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[][];
    push: Pixel;
    loaded: boolean;
    version: string;
};

declare global {
    interface Window {
        fbq?: Pixel;
        _fbq?: Pixel;
    }
}

export const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const events: Record<string, { name: string; custom?: boolean }> = {
    page_view: { name: 'PageView' },
    begin_checkout: { name: 'InitiateCheckout' },
    purchase: { name: 'Purchase' },
    use_case_clicked: { name: 'use_case_clicked', custom: true },
    variant_selected: { name: 'variant_selected', custom: true },
};
let initialized = false;
let identified = false;
let lastPage: string | undefined;

/** Limits advertising collection to public website and checkout pages in production. */
export function canTrackMetaPixel() {
    return (
        typeof window !== 'undefined' &&
        process.env.NODE_ENV === 'production' &&
        !!metaPixelId &&
        !/^\/(?:admin|customer|recovery|login|sign-in|change-password)(?:\/|$)/.test(
            window.location.pathname,
        ) &&
        hasAdvertisingConsent()
    );
}

/** Prepares Meta's command queue and applies the current advertising permission. */
export function syncMetaPixel() {
    if (!canTrackMetaPixel()) {
        window.fbq?.('consent', 'revoke');
        lastPage = undefined;
        return;
    }
    if (!window.fbq) {
        const pixel = function (...args: unknown[]) {
            if (pixel.callMethod) pixel.callMethod(...args);
            else pixel.queue.push(args);
        } as Pixel;
        pixel.queue = [];
        pixel.push = pixel;
        pixel.loaded = true;
        pixel.version = '2.0';
        window.fbq = pixel;
        window._fbq = pixel;
    }
    window.fbq('consent', 'grant');
    if (!initialized) {
        window.fbq('set', 'autoConfig', false, metaPixelId);
        window.fbq('init', metaPixelId);
        initialized = true;
    }
}

/** Associates the purchasing visitor with Meta events using explicitly supplied contact details. */
export function identifyMetaVisitor(email: string, phone?: string | null) {
    if (!canTrackMetaPixel() || identified || !email.trim()) return;
    try {
        syncMetaPixel();
        const digits = phone?.replace(/\D/g, '') ?? '';
        const internationalPhone = digits.length === 10 ? `1${digits}` : digits;
        window.fbq?.('init', metaPixelId, {
            em: email.trim().toLowerCase(),
            ...(internationalPhone.length >= 11 && internationalPhone.length <= 15
                ? { ph: internationalPhone }
                : {}),
        });
        identified = true;
    } catch {
        // Advertising failures must not interrupt the user's action.
    }
}

/** Sends supported advertising events while preventing repeated page views. */
export function trackMetaEvent(name: string, parameters?: EventParams) {
    if (!canTrackMetaPixel() || !events[name]) return false;
    try {
        syncMetaPixel();
        if (name === 'page_view') {
            const page = window.location.pathname;
            if (lastPage === page) return false;
            lastPage = page;
        }
        const order = name === 'purchase' ? String(parameters?.transaction_id ?? '') : '';
        if (name === 'purchase' && !order) return false;
        const details = {
            ...(parameters?.value !== undefined ? { value: parameters.value } : {}),
            ...(parameters?.currency ? { currency: parameters.currency } : {}),
            ...(parameters?.sticker_quantity ? { num_items: parameters.sticker_quantity } : {}),
            ...(parameters?.use_case ? { use_case: parameters.use_case } : {}),
            ...(parameters?.variant ? { variant: parameters.variant } : {}),
            ...(parameters?.variants ? { variants: parameters.variants } : {}),
            ...(parameters?.source ? { source: parameters.source } : {}),
            ...(Array.isArray(parameters?.items)
                ? {
                      content_type: 'product',
                      content_ids: parameters.items.map((item) => item.item_id),
                      contents: parameters.items.map((item) => ({
                          id: item.item_id,
                          quantity: item.quantity,
                      })),
                  }
                : {}),
        };
        window.fbq?.(
            events[name].custom ? 'trackSingleCustom' : 'trackSingle',
            metaPixelId,
            events[name].name,
            details,
            ...(order ? [{ eventID: `purchase_${order}` }] : []),
        );
        return true;
    } catch {
        // Advertising failures must not interrupt the user's action.
        return false;
    }
}
