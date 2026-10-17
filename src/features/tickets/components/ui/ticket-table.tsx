"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { PortalTable } from "@/components/platform";
import { Button } from "@/components/core/ui/button";
import TypographyH3 from "@/components/core/ui/typography-h3";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useTicketTable } from "@/features/tickets/components/hooks/use.ticket.table";
import TicketDetailsDialog from "@/features/tickets/components/ui/ticket-details-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/core/ui/select";
import { ticketStatuses } from "@/features/tickets/data/ticket.statuses";
import type { TicketStatusFilter } from "@/features/tickets/utils/ticket.types";

/** Presents the signed-in customer's support ticket history. */
export default function TicketTable({ audience = "customer" }: { audience?: "customer" | "admin" }) {
    const tNavigation = useTranslations("PortalNavigation");
    const { t, query, columns, search, setSearch, setSorting, pagination, setPagination, detailsRef, openTicket, status, changeStatus } = useTicketTable(audience);
    return (
        <section aria-label={t(audience === "admin" ? "adminTitle" : "title")} className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <TypographyH3 className="text-xl tracking-tight">{t(audience === "admin" ? "adminTitle" : "title")}</TypographyH3>
                    <TypographyParagraph className="text-sm text-muted-foreground">{t(audience === "admin" ? "adminDescription" : "description")}</TypographyParagraph>
                </div>
                {audience === "customer" && <Button render={<Link href="/customer/tickets" />} nativeButton={false}>
                    <TypographyBody className="text-sm">{tNavigation("contactUs")}</TypographyBody>
                </Button>}
            </div>
            {query.isError && <div role="alert" className="flex flex-wrap items-center gap-2">
                <TypographyBody className="text-sm text-destructive">{t("loadError")}</TypographyBody>
                <Button type="button" variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
            </div>}
            <PortalTable data={query.data?.tickets ?? []} columns={columns} pagination={pagination} onPaginationChange={setPagination}
                search={search} onSearchChange={setSearch} onSortingChange={setSorting} isLoading={query.isLoading} onRowClick={openTicket}
                toolbarActions={(
                    <Select<TicketStatusFilter> value={status} onValueChange={value => { if (value) changeStatus(value); }} disabled={query.isFetching}>
                        <SelectTrigger aria-label={t("columns.status")}>
                            <SelectValue><TypographyBody className="text-sm">{status === "all" ? t("allStatuses") : t(`statuses.${status}`)}</TypographyBody></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all"><TypographyBody className="text-sm">{t("allStatuses")}</TypographyBody></SelectItem>
                            {ticketStatuses.map(value => <SelectItem key={value} value={value}><TypographyBody className="text-sm">{t(`statuses.${value}`)}</TypographyBody></SelectItem>)}
                        </SelectContent>
                    </Select>
                )} />
            <TicketDetailsDialog ref={detailsRef} audience={audience} />
        </section>
    );
}
