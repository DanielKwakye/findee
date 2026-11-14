'use client';

import { useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import type { PortalConfirmDialogHandle } from '@/components/platform';
import { setUserDeactivation } from '@/features/users/server/set.user.deactivation.action';

/** Manages account access changes and their confirmation for user management tables. */
export function useUserAccess(audience: 'admins' | 'customers') {
    const t = useTranslations('Customers');
    const queryClient = useQueryClient();
    const confirmRef = useRef<PortalConfirmDialogHandle>(null);
    const mutation = useMutation({
        mutationFn: setUserDeactivation,
        retry: false,
        /** Refreshes customer access status after an administrator changes it. */
        onSuccess() {
            return queryClient.invalidateQueries({ queryKey: [audience] });
        },
    });
    const { mutateAsync } = mutation;
    /** Confirms a temporary suspension or restoration of the selected customer's access. */
    const changeAccess = useCallback(
        (user: { id: string; email: string; deactivatedAt: Date | null }) => {
            const deactivated = !user.deactivatedAt;
            confirmRef.current?.open({
                title: t(deactivated ? 'deactivate' : 'reactivate'),
                description: t(deactivated ? 'deactivateDescription' : 'reactivateDescription', {
                    email: user.email,
                }),
                confirmLabel: t(deactivated ? 'deactivate' : 'reactivate'),
                errorMessage: t('accessError'),
                destructive: deactivated,
                onConfirm: () => mutateAsync({ id: user.id, deactivated }),
            });
        },
        [t, mutateAsync],
    );
    return { confirmRef, mutation, changeAccess };
}
