'use client';

import type { ComponentProps } from 'react';
import { Button } from '@/components/core/ui/button';
import { useLaunchDialogButton } from '@/features/notifications/components/hooks/use.launch.dialog';
import LaunchDialog from '@/features/notifications/components/ui/launch-dialog';

/** Renders a button that opens the launch subscription dialog. */
export default function LaunchDialogButton({
    children,
    className,
    variant,
}: Pick<ComponentProps<typeof Button>, 'children' | 'className' | 'variant'>) {
    const { dialogRef, openDialog } = useLaunchDialogButton();

    return (
        <>
            <Button type="button" className={className} variant={variant} onClick={openDialog}>
                {children}
            </Button>
            <LaunchDialog ref={dialogRef} />
        </>
    );
}
