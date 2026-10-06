import {useTranslations} from "next-intl";
import {Button} from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import type {PortalTableControlsProps} from "@/components/platform/utils/portal.table.types";

/** Renders page status and navigation for local or server-paginated tables. */
export default function PortalTablePagination<T extends object>({table, isLoading = false}: PortalTableControlsProps<T>) {
    const t = useTranslations("portalTable");
    const pageCount = table.getPageCount();
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TypographyBody className="text-sm text-muted-foreground">
                {t("pageStatus", {page: pageCount === 0 ? 0 : table.state.pagination.pageIndex + 1, pages: pageCount, total: table.getRowCount()})}
            </TypographyBody>
            <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" disabled={isLoading || !table.getCanPreviousPage()} onClick={() => table.previousPage()}>
                    <TypographyBody className="text-sm">{t("previous")}</TypographyBody>
                </Button>
                <Button type="button" variant="outline" disabled={isLoading || !table.getCanNextPage()} onClick={() => table.nextPage()}>
                    <TypographyBody className="text-sm">{t("next")}</TypographyBody>
                </Button>
            </div>
        </div>
    );
}
