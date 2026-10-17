"use client"

import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {usePortalNavigation} from "@/components/platform/hooks/use.portal.navigation"
import { usePortalOrderCounts } from "@/components/platform/hooks/use.portal.order.counts"
import { Badge } from "@/components/core/ui/badge"
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
                            groupLabel = "inventory",
                        }: {
    items: PortalInventoryItem[]
    groupLabel?: string
}) {
    const t = useTranslations("PortalNavigation")
    const {isActive} = usePortalNavigation()
    const { data: orderCounts } = usePortalOrderCounts(items.some(item => item.items?.some(subItem => subItem.badgeStatus)))

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                <TypographyBody className="text-xs">{t(groupLabel)}</TypographyBody>
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    item.items?.length ? <Collapsible
                        key={item.title}
                        defaultOpen={item.isActive || isActive(item.url) || item.items.some(subItem => isActive(subItem.url))}
                        className="group/collapsible"
                        render={
                            <SidebarMenuItem>
                                <CollapsibleTrigger
                                    render={
                                        <SidebarMenuButton tooltip={t(item.title)} isActive={isActive(item.url) || item.items?.some(subItem => isActive(subItem.url))}>
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
                                                    isActive={isActive(subItem.url, true)}
                                                    render={
                                                        <Link href={subItem.url} aria-current={isActive(subItem.url, true) ? "page" : undefined}>
                                                            <TypographyBody className="text-sm">{t(subItem.title)}</TypographyBody>
                                                            {subItem.badgeStatus && (orderCounts?.[subItem.badgeStatus] ?? 0) > 0 && <Badge variant="destructive" className="ms-auto bg-destructive text-primary-foreground tabular-nums dark:bg-destructive" aria-label={t("ordersInView", { label: t(subItem.title), count: orderCounts?.[subItem.badgeStatus] ?? 0 })}>
                                                                <TypographyBody className="text-xs">{orderCounts?.[subItem.badgeStatus]}</TypographyBody>
                                                            </Badge>}
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
                                isActive={isActive(item.url)}
                                tooltip={t(item.title)}
                                render={
                                    <Link href={item.url} aria-current={isActive(item.url) ? "page" : undefined}>
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
