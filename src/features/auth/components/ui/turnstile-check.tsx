"use client";

import Script from "next/script";
import TypographyBody from "@/components/core/ui/typography-body";
import { useTurnstile } from "@/features/auth/components/hooks/use.turnstile";
import type { TurnstileCheckProps } from "@/features/auth/utils/auth.types";

/** Presents the shared sign-in bot check and any loading failure. */
export function TurnstileCheck(props: TurnstileCheckProps) {
    const { t, containerRef, failed, setReady, setFailed } = useTurnstile(props);
    return (
        <div className="min-w-0" aria-label={t("label")}>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                onReady={() => setReady(true)} onError={() => setFailed(true)} />
            <div ref={containerRef} />
            {failed && <div role="alert"><TypographyBody className="text-sm text-destructive">{t("unavailable")}</TypographyBody></div>}
        </div>
    );
}
