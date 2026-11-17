'use client';

import { useRef, useSyncExternalStore, type MouseEvent } from 'react';
import type { LaunchDialogHandle } from '@/features/notifications/utils/sticker.availability.types';
import { launched } from '@/lib/launch.constants';
import { usePathname } from 'next/navigation';
import { mobileNavbarMenuItems } from '@/components/platform/data/mobile.navbar.menuItems';
import {
    getScrollState,
    getServerScrollState,
    subscribeToScroll,
} from '@/components/platform/utils/navbar.utils';

/** Coordinates state and interactions for the web navigation bar. */
export function useNavbarWeb() {
    const pathname = usePathname();
    return {
        isHome: pathname === '/',
        isScrolled: useSyncExternalStore(subscribeToScroll, getScrollState, getServerScrollState),
        showAccount: pathname !== '/',
        showGetYourQrs:
            pathname !== '/' && pathname !== '/checkout' && !pathname.startsWith('/checkout/'),
    };
}

/** Coordinates state and interactions for the mobile navigation bar. */
export function useNavbarMobile() {
    const menuRef = useRef<{ open: () => void }>(null);
    const launchDialogRef = useRef<LaunchDialogHandle>(null);
    const pathname = usePathname();
    const activeTab = mobileNavbarMenuItems.find((item) => item.href === pathname)?.href ?? null;

    /** Opens launch subscriptions when checkout navigation is gated. */
    function onGetYours(event: MouseEvent<HTMLAnchorElement>) {
        if (!launched) return;
        event.preventDefault();
        launchDialogRef.current?.open();
    }

    return {
        menuRef,
        launchDialogRef,
        onGetYours,
        activeTab,
        showAccount: pathname !== '/',
    };
}
