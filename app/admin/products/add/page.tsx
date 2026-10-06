import TypographyBody from "@/components/core/ui/typography-body";
import {getTranslations} from "next-intl/server";
import {requireAdmin} from "@/features/auth/server/auth.session";

/** Renders the portal's product creation page. */
export default async function AddProductsPage() {
    await requireAdmin();
    const t = await getTranslations("addProducts");

    return (
        <div className="flex justify-center items-center">
            <TypographyBody>{t("placeholder")}</TypographyBody>
        </div>
    );
}
