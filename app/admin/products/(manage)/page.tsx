import TypographyBody from "@/components/core/ui/typography-body";
import {getTranslations} from "next-intl/server";
import {requireAdmin} from "@/features/auth/server/auth.session";

/** Renders the portal's existing product management page. */
export default async function ProductsPage() {
    await requireAdmin();
    const t = await getTranslations("products");

    return (
        <div className="flex justify-center items-center">
            <TypographyBody>{t("placeholder")}</TypographyBody>
        </div>
    );
}
