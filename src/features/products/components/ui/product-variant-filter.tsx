"use client";

import {useTranslations} from "next-intl";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/core/ui/select";
import TypographyBody from "@/components/core/ui/typography-body";
import {qrVariants} from "@/features/procurement/utils/procurement.generation";
import type {ProductVariantFilterValue} from "@/features/products/utils/product.types";

/** Renders the shared inventory variant selector. */
export default function ProductVariantFilter({value, onChange, disabled}: {
    value: ProductVariantFilterValue; onChange: (value: ProductVariantFilterValue) => void; disabled: boolean;
}) {
    const t = useTranslations("products");
    const variants = useTranslations("procurement.generation");
    return (
        <Select<ProductVariantFilterValue> value={value} onValueChange={next => {if (next) onChange(next);}} disabled={disabled}>
            <SelectTrigger aria-label={t("variant")}>
                <SelectValue><TypographyBody className="text-sm">{value === "all" ? t("allVariants") : variants(value)}</TypographyBody></SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all"><TypographyBody className="text-sm">{t("allVariants")}</TypographyBody></SelectItem>
                {qrVariants.map(variant => (
                    <SelectItem key={variant} value={variant}><TypographyBody className="text-sm">{variants(variant)}</TypographyBody></SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
