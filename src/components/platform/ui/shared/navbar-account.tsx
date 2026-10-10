"use client";

import { LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import { useNavbarAccount } from "@/components/platform/hooks/use.navbar.account";
import { cn } from "@/lib/utils";

/** Presents the visitor account action in shared navigation. */
export default function NavbarAccount() {
    const { t, isAuthenticated, session, logout } = useNavbarAccount();
    const label = t(isAuthenticated ? logout.isPending ? "loggingOut" : "logout" : "account");

    return (
        <Button type="button" variant="ghost" size="icon" className={cn("text-inherit", isAuthenticated && "xl:w-auto xl:gap-2 xl:px-3")} aria-label={label}
            title={logout.isError ? t("logoutError") : label} disabled={session.isPending || session.isError || logout.isPending}
            onClick={isAuthenticated ? () => logout.mutate() : undefined}>
            {isAuthenticated ? <LogOut aria-hidden="true" className="size-4" strokeWidth={1.8} />
                : <UserRound aria-hidden="true" className="size-4" strokeWidth={1.8} />}
            {isAuthenticated && <TypographyBody className="hidden text-sm xl:block">{label}</TypographyBody>}
        </Button>
    );
}
