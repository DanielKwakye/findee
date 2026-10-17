"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { TurnstileApi, TurnstileCheckProps } from "@/features/auth/utils/auth.types";

/** Manages the shared bot check, token lifecycle, and widget cleanup. */
export function useTurnstile({ action, onToken, resetKey }: TurnstileCheckProps) {
    const t = useTranslations("Auth.botCheck");
    const locale = useLocale();
    const containerRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    useEffect(() => {
        const api = (window as Window & { turnstile?: TurnstileApi }).turnstile;
        if (!ready || !sitekey || !api || !containerRef.current) return;
        onToken("");
        let active = true;
        const widget = api.render(containerRef.current, {
            sitekey, action, language: locale, size: "flexible", appearance: "interaction-only",
            "response-field": false,
            /** Supplies the fresh token to the sign-in form. */
            callback(token: string) { if (active) { setFailed(false); onToken(token); } },
            /** Clears expired tokens while Turnstile refreshes the check. */
            "expired-callback"() { if (active) onToken(""); },
            /** Keeps failed checks from being submitted and provides retry guidance. */
            "error-callback"() { if (active) { onToken(""); setFailed(true); } },
            /** Clears tokens when an interactive check times out. */
            "timeout-callback"() { if (active) onToken(""); },
        });
        return () => { active = false; api.remove(widget); };
    }, [ready, sitekey, action, locale, onToken, resetKey]);

    return { t, containerRef, failed: failed || !sitekey, setReady, setFailed };
}
