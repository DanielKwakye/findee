"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/core/ui/tabs";
import TypographyBody from "@/components/core/ui/typography-body";
import { mobileNavbarMenuItems } from "@/components/platform/data/mobile.navbar.menuItems";
import { useNavbarMobile } from "@/components/platform/hooks/use.navbar";
import AppIcon from "@/components/platform/ui/shared/app-icon";
import NavbarAccount from "@/components/platform/ui/shared/navbar-account";
import NavbarMenu from "@/components/platform/ui/mobile/navbar-menu";
import { cn } from "@/lib/utils";

type MobileNavbarProps = {
  appearance?: "overlay" | "solid" | "primary";
  elevated?: boolean;
};

/** Renders navigation for the mobile platform layout. */
export default function MobileNavbar({ appearance = "overlay", elevated = false }: MobileNavbarProps) {
  const { activeTab, showAccount, menuRef } = useNavbarMobile();
  const t = useTranslations("recovery");
  const tNav = useTranslations("Navbar");

  return (
    <>
      <header className={cn("inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-5 xl:hidden", appearance === "solid" ? "fixed border-b border-border bg-background text-foreground" : "absolute", appearance === "solid" && elevated && "shadow-sm", appearance === "primary" ? "bg-primary text-primary-foreground" : appearance === "overlay" && "text-background")}>
        <Link href="/" aria-label={t("home")}>
          <AppIcon brightness={appearance === "solid" ? "dark" : "light"} size="compact" showName={!showAccount} />
        </Link>
        {showAccount && <NavbarAccount />}
      </header>

      <nav
        aria-label={tNav("primaryNavigation")}
        className="fixed left-1/2 z-50 flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-foreground/10 bg-background p-1 text-foreground shadow-xs xl:hidden"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <Tabs value={activeTab} className="w-fit">
          <TabsList className="flex w-fit bg-transparent p-0 group-data-horizontal/tabs:h-12">
            {mobileNavbarMenuItems.map(({ label, href, icon: Icon }) => (
              <TabsTrigger
                key={label}
                value={href}
                render={<Link href={href} aria-current={activeTab === href ? "page" : undefined} />}
                nativeButton={false}
                className="h-full w-[min(5rem,20vw)] flex-none flex-col gap-1 rounded-full px-1 py-0.5 text-foreground hover:text-foreground dark:text-foreground dark:hover:text-foreground data-active:bg-foreground/10 data-active:text-foreground dark:data-active:bg-foreground/10 dark:data-active:text-foreground"
              >
                <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
                <TypographyBody className="block text-center text-xs leading-tight whitespace-nowrap">{tNav(label)}</TypographyBody>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <button type="button" aria-haspopup="dialog" onClick={() => menuRef.current?.open()} className="flex h-12 w-[min(5rem,20vw)] flex-none flex-col items-center justify-center gap-1 rounded-full px-1 py-0.5 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-ring">
          <MenuIcon aria-hidden="true" className="size-4" strokeWidth={1.8} />
          <TypographyBody className="block text-center text-xs leading-tight whitespace-nowrap">{tNav("menus")}</TypographyBody>
        </button>
      </nav>
      <NavbarMenu ref={menuRef} />
    </>
  );
}
