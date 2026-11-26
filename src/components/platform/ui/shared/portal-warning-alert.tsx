import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/core/ui/alert';
import TypographyBody from '@/components/core/ui/typography-body';

/** Presents a warning message with an optional heading and supporting content. */
export function PortalWarningAlert({ title, children }: { title?: string; children: ReactNode }) {
    return (
        <Alert className="border-warning/20 bg-warning/10">
            <Info aria-hidden="true" className="text-warning" />
            {title && (
                <AlertTitle>
                    <TypographyBody className="text-sm font-medium">{title}</TypographyBody>
                </AlertTitle>
            )}
            <AlertDescription className="text-foreground">{children}</AlertDescription>
        </Alert>
    );
}
