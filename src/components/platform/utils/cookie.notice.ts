export type CookieNoticeHandle = { open: () => void };

const cookieName = 'findmus_cookie_notice_v2';
const cookieNoticeEvent = 'findmus-cookie-notice-change';

/** Checks whether this browser has acknowledged the current cookie notice. */
export function hasAcceptedCookieNotice() {
    try {
        return document.cookie
            .split(';')
            .some((cookie) =>
                [`${cookieName}=accepted`, `${cookieName}=rejected`].includes(cookie.trim()),
            );
    } catch {
        return false;
    }
}

/** Remembers cookie-notice acceptance without interrupting browsing if storage is restricted. */
export function rememberCookieNoticeAcceptance(advertising = true) {
    try {
        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${cookieName}=${advertising ? 'accepted' : 'rejected'}; Path=/; Max-Age=15552000; SameSite=Lax${secure}`;
    } catch {
        // A browser that blocks storage can still dismiss the notice for the current visit.
    }
    window.dispatchEvent(new Event(cookieNoticeEvent));
}

/** Checks whether this browser explicitly permits advertising cookies and matching. */
export function hasAdvertisingConsent() {
    try {
        return (
            typeof document !== 'undefined' &&
            document.cookie.split(';').some((cookie) => cookie.trim() === `${cookieName}=accepted`)
        );
    } catch {
        return false;
    }
}

/** Subscribes advertising integrations to cookie preference changes. */
export function subscribeCookieNotice(callback: () => void) {
    window.addEventListener(cookieNoticeEvent, callback);
    return () => window.removeEventListener(cookieNoticeEvent, callback);
}

/** Keeps advertising disabled during server rendering. */
export function getServerAdvertisingConsent() {
    return false;
}
