"use client"

import { type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {usePortalNavigation} from "@/components/platform/hooks/use.portal.navigation"
import { usePortalTicketCount } from "@/components/platform/hooks/use.portal.ticket.count"
import { usePortalProcurementCount } from "@/components/platform/hooks/use.portal.procurement.count"
import { Badge } from "@/components/core/ui/badge"
import TypographyBody from "@/components/core/ui/typography-body"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/core/ui/sidebar";

/** Renders the portal's internal navigation links. */
export function PortalNavProjects({
                                projects,
                            }: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const t = useTranslations("PortalNavigation")
    const {isActive} = usePortalNavigation()
    const { data: unresolvedTickets = 0 } = usePortalTicketCount()
    const { data: unpublishedProducts = 0 } = usePortalProcurementCount()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
                <TypographyBody className="text-xs">{t("internal")}</TypographyBody>
            </SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                            isActive={isActive(item.url)}
                            render={
                                <Link href={item.url} aria-current={isActive(item.url) ? "page" : undefined}>
                                    <item.icon />
                                    <TypographyBody className="text-sm">{t(item.name)}</TypographyBody>
                                    {item.name === "tickets" && unresolvedTickets > 0 && <Badge variant="destructive" className="ms-auto bg-destructive text-primary-foreground tabular-nums dark:bg-destructive" aria-label={t("unresolvedTickets", { count: unresolvedTickets })}>
                                        <TypographyBody className="text-xs">{unresolvedTickets}</TypographyBody>
                                    </Badge>}
                                    {item.name === "procurements" && unpublishedProducts > 0 && <Badge variant="destructive" className="ms-auto bg-destructive text-primary-foreground tabular-nums dark:bg-destructive" aria-label={t("unpublishedProducts", { count: unpublishedProducts })}>
                                        <TypographyBody className="text-xs">{unpublishedProducts}</TypographyBody>
                                    </Badge>}
                                </Link>
                            }
                        />
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
