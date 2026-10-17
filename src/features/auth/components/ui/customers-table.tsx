"use client";

import { PortalTable, PortalConfirmDialog } from "@/components/platform";
import { Button } from "@/components/core/ui/button";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyBody from "@/components/core/ui/typography-body";
import { useCustomersTable } from "@/features/auth/components/hooks/use.customers.table";

/** Presents customer accounts and customer management controls. */
export default function CustomersTable() {
    const { t, query, columns, confirmRef } = useCustomersTable();
    return (
        <section aria-label={t("title")} className="min-w-0 space-y-4">
            <TypographyH1>{t("title")}</TypographyH1>
            {query.isError && <div role="alert" className="flex flex-wrap items-center gap-2">
                <TypographyBody className="text-sm text-destructive">{t("loadError")}</TypographyBody>
                <Button type="button" variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}>
                    <TypographyBody className="text-sm">{t("retry")}</TypographyBody>
                </Button>
            </div>}
            <PortalTable data={query.data ?? []} columns={columns} isLoading={query.isLoading} />
            <PortalConfirmDialog ref={confirmRef} />
        </section>
    );
}
