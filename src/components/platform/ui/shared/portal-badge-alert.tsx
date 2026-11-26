'use client';

import TypographyBody from '@/components/core/ui/typography-body';
import { usePortalBadgeAlert } from '@/components/platform/hooks/use.portal.badge.alert';
import { PortalWarningAlert } from '@/components/platform/ui/shared/portal-warning-alert';

/** Presents the explanation for the active page's sidebar count badge. */
export function PortalBadgeAlert() {
    const { description } = usePortalBadgeAlert();
    if (!description) return null;
    return (
        <PortalWarningAlert>
            <TypographyBody className="text-sm">{description}</TypographyBody>
        </PortalWarningAlert>
    );
}
