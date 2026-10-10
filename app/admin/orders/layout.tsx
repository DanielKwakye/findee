import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import TypographyH2 from "@/components/core/ui/typography-h2";
import TypographyBody from "@/components/core/ui/typography-body";

/** Provides the shared heading and content layout for order management. */
export default async function OrdersLayout({ children }: { children: ReactNode }) {
    const t = await getTranslations("orders");
    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col">
                <TypographyH2>{t("heading")}</TypographyH2>
                <TypographyBody>{t("description")}</TypographyBody>
            </div>
            {children}
        </div>
    );
}
