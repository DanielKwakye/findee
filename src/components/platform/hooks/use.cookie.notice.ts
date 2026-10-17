"use client";

import { useEffect, useImperativeHandle, useState, type Ref } from "react";
import { hasAcceptedCookieNotice, rememberCookieNoticeAcceptance } from "@/components/platform/utils/cookie.notice";
import type { CookieNoticeHandle } from "@/components/platform/utils/cookie.notice";

/** Manages the cookie notice's visibility, imperative controls, and remembered acknowledgement. */
export function useCookieNotice(ref?: Ref<CookieNoticeHandle>) {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        /** Opens the cookie notice for review. */
        open() { setIsOpen(true); },
    }), []);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            if (!hasAcceptedCookieNotice()) setIsOpen(true);
        });
        return () => window.cancelAnimationFrame(frame);
    }, []);

    /** Saves the browser's acknowledgement and dismisses the notice. */
    function accept() {
        rememberCookieNoticeAcceptance();
        setIsOpen(false);
    }

    return { isOpen, changeOpen: setIsOpen, accept };
}
