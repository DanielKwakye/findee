"use client"

import { type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {usePortalNavigation} from "@/components/platform/hooks/use.portal.navigation"
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
                                </Link>
                            }
                        />
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
