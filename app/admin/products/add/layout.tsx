import type {ReactNode} from "react";
import TypographyH2 from "@/components/core/ui/typography-h2";
import TypographyBody from "@/components/core/ui/typography-body";
import {getTranslations} from "next-intl/server";

/** Provides the shared heading and content layout for adding products. */
export default async function AddProductsLayout({ children }: { children: ReactNode }) {
    const t = await getTranslations("addProducts");

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col">
                <TypographyH2>{t("heading")}</TypographyH2>
                <TypographyBody>{t("description")}</TypographyBody>
            </div>
            {children}
        </div>
    );
}
