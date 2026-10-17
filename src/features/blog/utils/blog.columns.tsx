import type { useTranslations } from "next-intl";
import { Badge } from "@/components/core/ui/badge";
import TypographyBody from "@/components/core/ui/typography-body";
import type { PortalTableColumnDef } from "@/components/platform";
import type { BlogPostRow } from "@/features/blog/utils/blog.types";

/** Defines the administrator's story summary columns. */
export function getBlogPostColumns(t: ReturnType<typeof useTranslations>, formatDate: (date: Date) => string): PortalTableColumnDef<BlogPostRow>[] {
    return [
        { accessorKey: "title", header: t("fields.title"), enableSorting: false },
        { accessorKey: "author", header: t("fields.author"), enableSorting: false },
        { accessorKey: "published", header: t("status"), enableSorting: false,
            cell: ({ row }) => <Badge variant={row.original.published ? "default" : "secondary"}>
                <TypographyBody className="text-xs">{t(row.original.published ? "published" : "draft")}</TypographyBody>
            </Badge> },
        { accessorKey: "featured", header: t("fields.featured"), enableSorting: false,
            cell: ({ row }) => t(row.original.featured ? "yes" : "no") },
        { accessorKey: "createdAt", header: t("createdAt"), enableSorting: false, cell: ({ row }) => formatDate(row.original.createdAt) },
    ];
}
