import { useTranslations } from 'next-intl';
import TypographyBody from '@/components/core/ui/typography-body';
import { PortalWarningAlert } from '@/components/platform';

/** Explains when the assigned stickers need a manual review. */
export default function OrderAllocationAlert() {
    const t = useTranslations('orders.allocationMismatch');

    return (
        <PortalWarningAlert title={t('title')}>
            <TypographyBody className="text-sm">{t('description')}</TypographyBody>
        </PortalWarningAlert>
    );
}
