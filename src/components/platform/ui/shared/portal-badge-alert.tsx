"use client";

import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/core/ui/alert";
import TypographyBody from "@/components/core/ui/typography-body";
import { usePortalBadgeAlert } from "@/components/platform/hooks/use.portal.badge.alert";

/** Presents the explanation for the active page's sidebar count badge. */
export function PortalBadgeAlert() {
    const { description } = usePortalBadgeAlert();
    if (!description) return null;
    return (
        <Alert className="border-warning/20 bg-warning/10">
            <Info aria-hidden="true" className="text-warning" />
            <AlertDescription className="text-foreground"><TypographyBody className="text-sm">{description}</TypographyBody></AlertDescription>
        </Alert>
    );
}
