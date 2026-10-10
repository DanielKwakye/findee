"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { mobileNavbarMenuItems } from "@/components/platform/data/mobile.navbar.menuItems";
import { getScrollState, getServerScrollState, subscribeToScroll } from "@/components/platform/utils/navbar.utils";

/** Coordinates state and interactions for the web navigation bar. */
export function useNavbarWeb() {
  const pathname = usePathname();
  return { isScrolled: useSyncExternalStore(subscribeToScroll, getScrollState, getServerScrollState), showAccount: pathname !== "/" };
}

/** Coordinates state and interactions for the mobile navigation bar. */
export function useNavbarMobile() {
  const pathname = usePathname();
  const activeTab = mobileNavbarMenuItems.find(item => item.href === pathname)?.href ?? null;

  return {
    activeTab,
    showAccount: pathname !== "/",
  };
}
