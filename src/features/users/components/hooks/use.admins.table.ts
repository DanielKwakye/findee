'use client';

import { createElement, useCallback, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getUsers } from '@/features/users/server/get.users.action';
import { getAdminColumns } from '@/features/users/utils/admin.columns';
import { useUserDateTime } from '@/components/platform';
import type { PortalTableColumnDef } from '@/components/platform';
import type { AdminRow, UpdateAdminDetailsDialogHandle } from '@/features/users/utils/users.types';
import UserActions from '@/features/users/components/ui/user-actions';
import { useUserAccess } from '@/features/users/components/hooks/use.user.access';
import { UserDepartments } from '@/features/users/utils/users.constants';

/** Manages administrator records and the management table's display columns. */
export function useAdminsTable(isDirector: boolean) {
    const t = useTranslations('Admins');
    const tDepartments = useTranslations('PortalTeamSwitcher.addForm.departmentOptions');
    const updateDetailsRef = useRef<UpdateAdminDetailsDialogHandle>(null);
    /** Opens the selected administrator's name editor. */
    const updateDetails = useCallback((admin: AdminRow) => {
        updateDetailsRef.current?.open(admin);
    }, []);
    const formatDate = useUserDateTime();
    const tAccess = useTranslations('Customers');
    const { confirmRef, mutation, changeAccess } = useUserAccess('admins');
    const query = useQuery({ queryKey: ['admins'], queryFn: () => getUsers('ADMIN') });
    const columns = useMemo<PortalTableColumnDef<AdminRow>[]>(
        () => [
            ...getAdminColumns(
                {
                    name: t('name'),
                    email: t('email'),
                    departments: t('departments'),
                    departmentNames: Object.fromEntries(
                        Object.values(UserDepartments).map((department) => [
                            department,
                            tDepartments(department),
                        ]),
                    ),
                    status: t('status'),
                    pending: t('pending'),
                    ready: t('ready'),
                    noName: t('noName'),
                    lastVisited: t('lastVisited'),
                    notRecorded: t('notRecorded'),
                },
                formatDate,
            ).filter(
                (column) =>
                    isDirector ||
                    !(
                        column.id === 'departments' ||
                        ('accessorKey' in column && column.accessorKey === 'lastPortalVisitedAt')
                    ),
            ),
            {
                id: 'actions',
                header: tAccess('actions'),
                enableSorting: false,
                enableHiding: false,
                cell: ({ row }) =>
                    createElement(UserActions, {
                        deactivated: !!row.original.deactivatedAt,
                        disabled: mutation.isPending,
                        onChangeAccess: isDirector ? () => changeAccess(row.original) : undefined,
                        onUpdateDetails: () => updateDetails(row.original),
                    }),
            },
        ],
        [
            t,
            tDepartments,
            formatDate,
            isDirector,
            tAccess,
            mutation.isPending,
            changeAccess,
            updateDetails,
        ],
    );
    return { t, query, columns, confirmRef, updateDetailsRef };
}
