"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { mobileNavbarMenuItems } from "@/components/platform/data/mobile.navbar.menuItems";
import { getScrollState, getServerScrollState, subscribeToScroll } from "@/components/platform/utils/navbar.utils";

/** Coordinates state and interactions for the web navigation bar. */
export function useNavbarWeb() {
  return { isScrolled: useSyncExternalStore(subscribeToScroll, getScrollState, getServerScrollState) };
}

/** Coordinates state and interactions for the mobile navigation bar. */
export function useNavbarMobile(cartCount: number) {
  const pathname = usePathname();
  const activeTab = mobileNavbarMenuItems.find(item => item.href === pathname)?.href ?? null;

  return {
    activeTab,
    showCartCount: cartCount > 0,
    cartLabel: cartCount > 99 ? "99+" : String(cartCount),
  };
}
