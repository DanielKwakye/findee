import TypographyBody from '@/components/core/ui/typography-body';
import type { Metadata } from 'next';
import messages from '@/translations/en.json';
import { getTranslations } from 'next-intl/server';
import { requireAdmin } from '@/features/auth/server/auth.session';
import { UserDepartments } from '@/features/users/utils/users.constants';

export const metadata: Metadata = { title: messages.PageMetadata.titles.addProducts };

/** Renders the portal's product creation page. */
export default async function AddProductsPage() {
    await requireAdmin({ department: UserDepartments.operations });
    const t = await getTranslations('addProducts');

    return (
        <div className="flex justify-center items-center">
            <TypographyBody>{t('placeholder')}</TypographyBody>
        </div>
    );
}
