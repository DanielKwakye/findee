'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { usePortalSidebar } from '@/components/platform/hooks/use.portal.sidebar';
import { portalInventoryItems } from '@/components/platform/data/portal.sidebar.menuItems';

/** Personalizes the portal welcome using the administrator's local time. */
export function useAdminWelcome(name: string | null, departments: string[]) {
    const { internalItems, canViewSales } = usePortalSidebar(departments);
    const links = [
        ...portalInventoryItems
            .filter((item) => canViewSales && item.title === 'orders')
            .map((item) => ({ name: item.title, url: item.url })),
        ...internalItems.filter(
            (item) => item.name === 'products' || item.name === 'tickets' || item.name === 'blog',
        ),
    ];
    const subscribe = useCallback((onChange: () => void) => {
        const interval = window.setInterval(onChange, 60_000);
        window.addEventListener('focus', onChange);
        return () => {
            window.clearInterval(interval);
            window.removeEventListener('focus', onChange);
        };
    }, []);
    const hour = useSyncExternalStore(
        subscribe,
        () => new Date().getHours(),
        () => -1,
    );
    const period =
        hour < 0 ? 'welcome' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const firstName = name?.trim().split(/\s+/)[0] || null;
    return { period, firstName, links };
}
