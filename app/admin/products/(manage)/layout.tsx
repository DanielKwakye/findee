import type {ReactNode} from "react";
import TypographyH2 from "@/components/core/ui/typography-h2";
import TypographyBody from "@/components/core/ui/typography-body";
import {getTranslations} from "next-intl/server";

/** Provides the shared heading and content layout for managing existing products. */
export default async function ProductsLayout({ children }: { children: ReactNode }) {
    const t = await getTranslations("products");

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
