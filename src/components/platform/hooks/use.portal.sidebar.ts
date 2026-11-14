'use client';

import { useRef } from 'react';
import type { FeatureRequestDialogHandle } from '@/features/tickets/utils/ticket.types';
import { portalInternalItems } from '@/components/platform/data/portal.sidebar.menuItems';
import { UserDepartments } from '@/features/users/utils/users.constants';

/** Manages customer sidebar dialog interactions. */
export function usePortalSidebar(departments: string[]) {
    const featureRequestRef = useRef<FeatureRequestDialogHandle>(null);
    const internalItems = portalInternalItems.filter(
        (item) =>
            ((item.name !== 'products' && item.name !== 'procurements') ||
                departments.includes(UserDepartments.operations)) &&
            (item.name !== 'tickets' || departments.includes(UserDepartments.support)) &&
            (item.name !== 'blog' || departments.includes(UserDepartments.marketing)),
    );
    /** Opens the customer's feature request form. */
    function requestFeature() {
        featureRequestRef.current?.open();
    }
    const canAddAdmin = departments.includes(UserDepartments.directors);
    const canViewSales = departments.includes(UserDepartments.sales);
    return { featureRequestRef, requestFeature, internalItems, canAddAdmin, canViewSales };
}
