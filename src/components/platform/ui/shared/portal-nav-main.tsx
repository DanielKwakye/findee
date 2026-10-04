"use client"

import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import TypographyBody from "@/components/core/ui/typography-body"
import type { PortalInventoryItem } from "@/components/platform/data/portal.sidebar.menuItems"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/core/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/core/ui/sidebar"

/** Renders the primary portal navigation and its expandable groups. */
export function PortalNavMain({
                            items,
                        }: {
    items: PortalInventoryItem[]
}) {
    const t = useTranslations("PortalNavigation")

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                <TypographyBody className="text-xs">{t("inventory")}</TypographyBody>
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    item.items?.length ? <Collapsible
                        key={item.title}
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                        render={
                            <SidebarMenuItem>
                                <CollapsibleTrigger
                                    render={
                                        <SidebarMenuButton tooltip={t(item.title)}>
                                            {item.icon && <item.icon />}
                                            <TypographyBody className="text-sm">{t(item.title)}</TypographyBody>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    }
                                />
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    render={
                                                        <Link href={subItem.url}>
                                                            <TypographyBody className="text-sm">{t(subItem.title)}</TypographyBody>
                                                        </Link>
                                                    }
                                                />
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        }
                    /> : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={t(item.title)}
                                render={
                                    <Link href={item.url}>
                                        <item.icon />
                                        <TypographyBody className="text-sm">{t(item.title)}</TypographyBody>
                                    </Link>
                                }
                            />
                        </SidebarMenuItem>
                    )
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
