"use client";

import { UserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import { useNavbarAccount } from "@/components/platform/hooks/use.navbar.account";
import { cn } from "@/lib/utils";

/** Presents the visitor account action in shared navigation. */
export default function NavbarAccount() {
    const { t, isAuthenticated, session } = useNavbarAccount();
    const label = t("account");

    return (
        <Button variant="ghost" size="icon" render={<Link href={isAuthenticated ? "/customer" : "/sign-in"} />} nativeButton={false} className={cn("text-inherit", isAuthenticated && "xl:w-auto xl:gap-2 xl:px-3")} aria-label={label}
            title={label} disabled={session.isPending || session.isError}>
            <UserRound aria-hidden="true" className="size-4" strokeWidth={1.8} />
            {isAuthenticated && <TypographyBody className="hidden text-sm xl:block">{label}</TypographyBody>}
        </Button>
    );
}
