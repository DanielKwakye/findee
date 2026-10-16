"use client";

import type { Ref } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronRightIcon } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from "@/components/core/ui/drawer";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import { navbarMenuItems } from "@/components/platform/data/navbar.menuItems";
import { useNavbarMenu } from "@/components/platform/hooks/use.navbar.menu";

/** Presents shared site navigation in the mobile menu drawer. */
export default function NavbarMenu({ ref }: { ref: Ref<{ open: () => void }> }) {
  const t = useTranslations("Navbar");
  const { isOpen, setOpen } = useNavbarMenu(ref);

  return (
    <Drawer open={isOpen} onOpenChange={setOpen} showSwipeHandle>
      <DrawerContent aria-label={t("menus")} aria-labelledby={undefined} aria-describedby={undefined}>
        <nav aria-label={t("primaryNavigation")} className="min-h-0 overflow-y-auto p-4">
          {navbarMenuItems.map(({ key, href, icon: Icon }) => (
            <DrawerClose key={key} render={<Link href={href} />} nativeButton={false} className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">
              <Icon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
              <div className="flex-1">
                <TypographyBody className="block font-medium">{t(`items.${key}.label`)}</TypographyBody>
                <TypographyBody className="block text-sm text-muted-foreground">{t(`items.${key}.description`)}</TypographyBody>
              </div>
              <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            </DrawerClose>
          ))}
        </nav>
        <DrawerFooter className="pb-[max(1rem,env(safe-area-inset-bottom))]">
          <DrawerClose render={<Button variant="outline" />}><TypographyBody className="text-sm">{t("close")}</TypographyBody></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
