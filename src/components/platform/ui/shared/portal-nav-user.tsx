"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react"

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
                        }: {
    user: {
        name: string | null
        email: string
        avatar?: string
    }
}) {
    const { isMobile, logout, t } = usePortalUser();
    const name = t("admin");
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
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
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
