"use client"

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import TypographyBody from "@/components/core/ui/typography-body";
import AddAdminDialog from "@/features/auth/components/ui/add-admin-dialog";
import type { AddAdminDialogHandle } from "@/features/auth/utils/auth.types";
import { ChevronsUpDown, Plus, Users } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/core/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/core/ui/sidebar";

/** Renders the portal team selector and manages the active team. */
export function PortalTeamSwitcher({
                                 teams,
                             }: {
    teams: {
        name: string
        logo: React.ElementType
        plan: string
    }[]
}) {
    const { isMobile } = useSidebar()
    const t = useTranslations("PortalTeamSwitcher")
    const addAdminRef = React.useRef<AddAdminDialogHandle>(null)
    const activeTeam = teams[0]

    if (!activeTeam) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <activeTeam.logo className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <TypographyBody className="truncate font-medium">{t(activeTeam.name)}</TypographyBody>
                                    <TypographyBody className="truncate text-xs">{t(activeTeam.plan)}</TypographyBody>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        }
                    />
                    <DropdownMenuContent
                        className="w-(--anchor-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                <TypographyBody className="text-xs">{t("admins")}</TypographyBody>
                            </DropdownMenuLabel>
                            {teams.map((team, index) => (
                                <DropdownMenuItem
                                    key={team.name}
                                    render={<Link href="/admin/admins" />}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-md border">
                                        <team.logo className="size-3.5 shrink-0" />
                                    </div>
                                    <TypographyBody>{t("manageAdmin")}</TypographyBody>
                                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem render={<Link href="/admin/customers" />} className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <Users className="size-3.5 shrink-0" />
                                </div>
                                <TypographyBody>{t("manageCustomers")}</TypographyBody>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2" onClick={() => addAdminRef.current?.open()}>
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <TypographyBody className="font-medium text-muted-foreground">{t("addAdmin")}</TypographyBody>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AddAdminDialog ref={addAdminRef} />
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
