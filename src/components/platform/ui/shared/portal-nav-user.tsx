"use client"

import {
    KeyRound,
    ChevronsUpDown,
    LogOut,
    Globe,
    FileText,
} from "lucide-react"
import Link from "next/link";
import {useTranslations} from "next-intl";
import {customerAccountLinks} from "@/components/platform/data/footer";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/core/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/core/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/core/ui/sidebar";
import { usePortalUser } from "@/components/platform/hooks/use.portal.user";
import TypographyBody from "@/components/core/ui/typography-body";

/** Renders the portal user's profile and account menu. */
export function PortalNavUser({
                            user,
                            audience = "admin",
                        }: {
    user: {
        name: string | null
        email: string
        avatar?: string
    }
    audience?: "admin" | "customer"
}) {
    const { isMobile, logout, t } = usePortalUser();
    const tFooter = useTranslations("Footer.links");
    const name = audience === "customer" ? user.name?.trim() || t("account") : t("admin");
    const initials = name.slice(0, 2).toUpperCase();

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
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {user.avatar && <AvatarImage src={user.avatar} alt={name} />}
                                    <AvatarFallback className="rounded-lg"><TypographyBody className="text-sm">{initials}</TypographyBody></AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <TypographyBody className="truncate text-sm font-medium">{name}</TypographyBody>
                                    <TypographyBody className="truncate text-xs">{user.email}</TypographyBody>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        }
                    />
                    <DropdownMenuContent
                        className="w-(--anchor-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {user.avatar && <AvatarImage src={user.avatar} alt={name} />}
                                        <AvatarFallback className="rounded-lg"><TypographyBody className="text-sm">{initials}</TypographyBody></AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <TypographyBody className="truncate text-sm font-medium">{name}</TypographyBody>
                                        <TypographyBody className="truncate text-xs">{user.email}</TypographyBody>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem render={<Link href="/" />}>
                                <Globe />
                                <TypographyBody className="text-sm">{t("website")}</TypographyBody>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        {audience === "customer" && <>
                            <DropdownMenuGroup>
                                {customerAccountLinks.map(({key, href}) => (
                                    <DropdownMenuItem key={key} render={<Link href={href} />}>
                                        <FileText />
                                        <TypographyBody className="text-sm">{tFooter(key)}</TypographyBody>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                        </>}
                        {audience === "admin" && <>
                        <DropdownMenuGroup>
                            <DropdownMenuItem render={<Link href="/change-password" />}>
                                <KeyRound />
                                <TypographyBody className="text-sm">{t("changePassword")}</TypographyBody>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        </>}
                        <DropdownMenuItem disabled={logout.isPending} onClick={() => logout.mutate()} closeOnClick={false}>
                            <LogOut />
                            <TypographyBody className="text-sm">{t(logout.isPending ? "loggingOut" : "logout")}</TypographyBody>
                        </DropdownMenuItem>
                        {logout.isError && <div role="alert" className="px-2 py-1 text-destructive"><TypographyBody className="text-sm">{t("logoutError")}</TypographyBody></div>}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
