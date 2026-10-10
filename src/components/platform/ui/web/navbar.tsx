"use client";

import Link from "next/link";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import { webNavbarMenuItems } from "@/components/platform/data/web.navbar.menuItems";
import { useNavbarWeb } from "@/components/platform/hooks/use.navbar";
import AppIcon from "@/components/platform/ui/shared/app-icon";
import NavbarAccount from "@/components/platform/ui/shared/navbar-account";
import { cn } from "@/lib/utils";

/** Renders navigation for the web platform layout. */
export default function WebNavbar({ appearance = "overlay", showGetStarted = true }: { appearance?: "overlay" | "solid" | "primary"; showGetStarted?: boolean }) {
  const { isScrolled, showAccount } = useNavbarWeb();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 hidden h-16 border-b transition-[background-color,color,border-color,box-shadow] duration-500 ease-in-out xl:block",
        appearance === "primary"
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : isScrolled || appearance === "solid"
          ? "border-border bg-background text-foreground shadow-sm"
          : "border-transparent bg-transparent text-background shadow-none",
      )}
    >
      <nav aria-label="Primary navigation" className="container mx-auto flex h-full items-center justify-between gap-8 px-6">
        <Link href="/" aria-label="Findee home" className="shrink-0">
          <AppIcon brightness={appearance === "primary" ? "primary" : isScrolled || appearance === "solid" ? "dark" : "light"} size="compact" />
        </Link>

        <div className="flex items-center gap-7">
          {webNavbarMenuItems.map(({ label, href }) => (
            <Link key={label} href={href} className="whitespace-nowrap transition-opacity hover:opacity-70">
              <TypographyBody className="text-sm">{label}</TypographyBody>
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-6">
          {showGetStarted && <Button variant={appearance === "primary" ? "secondary" : "default"} render={<Link href="/checkout" />} nativeButton={false}>
            <TypographyBody className="text-sm">Get Started</TypographyBody>
          </Button>}
          {showAccount && <NavbarAccount />}
        </div>
      </nav>
    </header>
  );
}
