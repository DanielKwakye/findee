"use client"

import { type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
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

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
                <TypographyBody className="text-xs">{t("internal")}</TypographyBody>
            </SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                            render={
                                <a href={item.url}>
                                    <item.icon />
                                    <TypographyBody className="text-sm">{t(item.name)}</TypographyBody>
                                </a>
                            }
                        />
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
