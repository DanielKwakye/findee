"use client";

import {usePathname} from "next/navigation";
import {useTranslations} from "next-intl";

/** Manages breadcrumb navigation for the current portal path. */
export function usePortalBreadcrumb() {
    const pathname = usePathname();
    const t = useTranslations("PortalBreadcrumb");
    const segments = pathname.split("/").filter(Boolean);
    return {
        label: t("label"),
        items: segments.map((segment, index) => ({
            href: `/${segments.slice(0, index + 1).join("/")}`,
            label: t.has(segment) ? t(segment) : t("record", {value: segment}),
            current: index === segments.length - 1,
        })),
    };
}
