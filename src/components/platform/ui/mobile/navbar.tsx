"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/core/ui/tabs";
import TypographyBody from "@/components/core/ui/typography-body";
import { mobileNavbarMenuItems } from "@/components/platform/data/mobile.navbar.menuItems";
import { useNavbarMobile } from "@/components/platform/hooks/use.navbar";
import AppIcon from "@/components/platform/ui/shared/app-icon";
import { cn } from "@/lib/utils";

type MobileNavbarProps = {
  cartCount?: number;
  appearance?: "overlay" | "solid" | "primary";
};

/** Renders navigation for the mobile platform layout. */
export default function MobileNavbar({ cartCount = 2, appearance = "overlay" }: MobileNavbarProps) {
  const { showCartCount, cartLabel, activeTab } = useNavbarMobile(cartCount);

  return (
    <>
      <header className={cn("absolute inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-5 xl:hidden", appearance === "primary" ? "bg-primary text-primary-foreground" : appearance === "solid" ? "bg-background text-foreground" : "text-background")}>
        <Link href="/" aria-label="Findee home">
          <AppIcon brightness={appearance === "solid" ? "dark" : "light"} size="compact" showName={false} />
        </Link>
        <Link href="#cart" aria-label={`Cart, ${cartCount} items`} className="relative p-1.5">
          <ShoppingCart aria-hidden="true" className="size-5" strokeWidth={1.8} />
          {showCartCount && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-background">
              <TypographyBody className="text-[10px] leading-none font-semibold">{cartLabel}</TypographyBody>
            </span>
          )}
        </Link>
      </header>

      <nav
        aria-label="Mobile primary navigation"
        className="fixed left-1/2 z-50 w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-foreground/10 bg-background p-1 text-foreground shadow-xs xl:hidden"
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
                <TypographyBody className="block text-center text-xs leading-tight whitespace-nowrap">{label}</TypographyBody>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </nav>
    </>
  );
}
