"use client";

import {useRef} from "react";
import {useTranslations} from "next-intl";
import type {GenerateQrDialogHandle} from "@/features/procurement/utils/procurement.types";

/** Manages the procurement header's generation dialog reference. */
export function useProcurementHeader() {
    const t = useTranslations("procurement");
    const dialogRef = useRef<GenerateQrDialogHandle>(null);
    return {t, dialogRef};
}
