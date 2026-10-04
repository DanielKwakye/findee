"use client"

import * as React from "react"
import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/core/ui/sidebar"
import {PortalNavMain} from "@/components/platform/ui/shared/portal-nav-main";
import {PortalTeamSwitcher} from "@/components/platform/ui/shared/portal-team-switcher";
import {PortalNavProjects} from "@/components/platform/ui/shared/portal-nav-projects";
import {PortalNavUser} from "@/components/platform/ui/shared/portal-nav-user";
import { portalInventoryItems, portalInternalItems } from "@/components/platform/data/portal.sidebar.menuItems";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
}

/** Renders the portal sidebar with team, navigation, and account controls. */
export function PortalSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <PortalTeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <PortalNavMain items={portalInventoryItems} />
                <PortalNavProjects projects={portalInternalItems} />
            </SidebarContent>
            <SidebarFooter>
                <PortalNavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
