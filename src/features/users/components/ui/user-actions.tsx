'use client';

import { useTranslations } from 'next-intl';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/core/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/core/ui/dropdown-menu';
import TypographyBody from '@/components/core/ui/typography-body';

/** Presents administrator actions for a customer account. */
export default function UserActions({
    deactivated,
    disabled,
    onChangeAccess,
    onRequestReview,
    onUpdateDetails,
}: {
    deactivated: boolean;
    disabled: boolean;
    onChangeAccess?: () => void;
    onRequestReview?: () => void;
    onUpdateDetails?: () => void;
}) {
    const t = useTranslations('Customers');
    const tAdmins = useTranslations('Admins');
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={t('actions')}
                        disabled={disabled}
                    />
                }
            >
                <MoreHorizontal aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {onUpdateDetails && (
                    <DropdownMenuItem onClick={onUpdateDetails}>
                        <TypographyBody className="text-sm">
                            {tAdmins('updateDetails')}
                        </TypographyBody>
                    </DropdownMenuItem>
                )}
                {onChangeAccess && (
                    <DropdownMenuItem onClick={onChangeAccess}>
                        <TypographyBody className="text-sm">
                            {t(deactivated ? 'reactivate' : 'deactivate')}
                        </TypographyBody>
                    </DropdownMenuItem>
                )}
                {onRequestReview && (
                    <DropdownMenuItem onClick={onRequestReview}>
                        <TypographyBody className="text-sm">{t('requestReview')}</TypographyBody>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
