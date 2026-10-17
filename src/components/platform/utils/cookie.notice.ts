export type CookieNoticeHandle = { open: () => void };

const cookieName = "findmus_cookie_notice_v1";

/** Checks whether this browser has acknowledged the current cookie notice. */
export function hasAcceptedCookieNotice() {
    try {
        return document.cookie.split(";").some(cookie => cookie.trim() === `${cookieName}=accepted`);
    } catch {
        return false;
    }
}

/** Remembers cookie-notice acceptance without interrupting browsing if storage is restricted. */
export function rememberCookieNoticeAcceptance() {
    try {
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${cookieName}=accepted; Path=/; Max-Age=15552000; SameSite=Lax${secure}`;
    } catch {
        // A browser that blocks storage can still dismiss the notice for the current visit.
    }
}
