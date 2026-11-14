'use client';

import { PortalTable, PortalConfirmDialog } from '@/components/platform';
import { Button } from '@/components/core/ui/button';
import TypographyH1 from '@/components/core/ui/typography-h1';
import TypographyBody from '@/components/core/ui/typography-body';
import { useAdminsTable } from '@/features/users/components/hooks/use.admins.table';
import UpdateAdminDetailsDialog from '@/features/users/components/ui/update-admin-details-dialog';

/** Presents searchable administrator accounts using the shared portal table. */
export default function AdminsTable({ isDirector }: { isDirector: boolean }) {
    const { t, query, columns, confirmRef, updateDetailsRef } = useAdminsTable(isDirector);
    return (
        <section aria-label={t('title')} className="min-w-0 space-y-4">
            <TypographyH1>{t('title')}</TypographyH1>
            {query.isError && (
                <div role="alert" className="flex flex-wrap items-center gap-2">
                    <TypographyBody className="text-sm text-destructive">
                        {t('loadError')}
                    </TypographyBody>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={query.isFetching}
                        onClick={() => query.refetch()}
                    >
                        <TypographyBody className="text-sm">{t('retry')}</TypographyBody>
                    </Button>
                </div>
            )}
            <PortalTable data={query.data ?? []} columns={columns} isLoading={query.isLoading} />
            <PortalConfirmDialog ref={confirmRef} />
            <UpdateAdminDetailsDialog ref={updateDetailsRef} isDirector={isDirector} />
        </section>
    );
}
