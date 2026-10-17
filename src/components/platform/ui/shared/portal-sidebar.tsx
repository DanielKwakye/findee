"use client"

import * as React from "react"
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    GalleryVerticalEnd,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/core/ui/sidebar"
import {PortalNavMain} from "@/components/platform/ui/shared/portal-nav-main";
import {PortalTeamSwitcher} from "@/components/platform/ui/shared/portal-team-switcher";
import {PortalNavProjects} from "@/components/platform/ui/shared/portal-nav-projects";
import {PortalNavUser} from "@/components/platform/ui/shared/portal-nav-user";
import { portalInventoryItems, portalInternalItems, portalCustomerItems } from "@/components/platform/data/portal.sidebar.menuItems";
import AppIcon from "@/components/platform/ui/shared/app-icon";

// This is sample data.
const data = {
    teams: [
        {
            name: "brand",
            logo: GalleryVerticalEnd,
            plan: "plan",
        },
    ],
}

/** Renders the portal sidebar with team, navigation, and account controls. */
export function PortalSidebar({ user, audience = "admin", ...props }: React.ComponentProps<typeof Sidebar> & {
    user: { name: string | null; email: string };
    audience?: "admin" | "customer";
}) {
    const t = useTranslations("Footer");
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {audience === "customer" ? (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" render={<Link href="/" aria-label={t("home")} />}>
                                <AppIcon size="compact" className="group-data-[collapsible=icon]:[&>span]:hidden" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ) : <PortalTeamSwitcher teams={data.teams} />}
            </SidebarHeader>
            <SidebarContent>
                <PortalNavMain items={audience === "customer" ? portalCustomerItems : portalInventoryItems} groupLabel={audience === "customer" ? "account" : "inventory"} />
                {audience === "admin" && <PortalNavProjects projects={portalInternalItems} />}
            </SidebarContent>
            <SidebarFooter>
                <PortalNavUser user={user} audience={audience} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
