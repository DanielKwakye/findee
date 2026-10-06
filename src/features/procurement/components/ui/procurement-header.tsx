"use client";

import {Button} from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH2 from "@/components/core/ui/typography-h2";
import GenerateQrDialog from "@/features/procurement/components/ui/generate-qr-dialog";
import {useProcurementHeader} from "@/features/procurement/components/hooks/use.procurement.header";

/** Presents the procurement heading and its QR generation entry point. */
export default function ProcurementHeader() {
    const {t, dialogRef} = useProcurementHeader();
    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-col">
                    <TypographyH2>{t("heading")}</TypographyH2>
                    <TypographyBody>{t("description")}</TypographyBody>
                </div>
                <Button type="button" className="shrink-0" onClick={() => dialogRef.current?.open()}>
                    <TypographyBody className="text-sm font-medium">{t("generate")}</TypographyBody>
                </Button>
            </div>
            <GenerateQrDialog ref={dialogRef} />
        </>
    );
}
