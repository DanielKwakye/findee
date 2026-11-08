'use client';

import { createElement, useCallback, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getUsers } from '@/features/users/server/get.users.action';
import { getCustomerColumns } from '@/features/users/utils/customer.columns';
import { useUserDateTime } from '@/components/platform';
import type { PortalConfirmDialogHandle, PortalTableColumnDef } from '@/components/platform';
import CustomerActions from '@/features/users/components/ui/customer-actions';
import { requestCustomerReview } from '@/features/users/server/request.customer.review.action';
import { toast } from '@/components/core/ui/toast';
import type { CustomerRow } from '@/features/users/utils/users.types';
import { setCustomerDeactivation } from '@/features/users/server/set.customer.deactivation.action';

/** Manages customer records and the customer management table's behavior. */
export function useCustomersTable() {
    const t = useTranslations('Customers');
    const formatDate = useUserDateTime();
    const queryClient = useQueryClient();
    const confirmRef = useRef<PortalConfirmDialogHandle>(null);
    const mutation = useMutation({
        mutationFn: setCustomerDeactivation,
        retry: false,
        /** Refreshes customer access status after an administrator changes it. */
        onSuccess() {
            return queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
    const { mutateAsync } = mutation;
    const reviewMutation = useMutation({
        mutationFn: requestCustomerReview,
        retry: false,
        /** Confirms acceptance of the review request by the email provider. */
        onSuccess({ email }) {
            toast.add({
                title: t('reviewRequested', { email }),
                type: 'info',
            });
            return queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        /** Reports review request delivery failures. */
        onError() {
            toast.add({ title: t('reviewRequestError'), type: 'error' });
        },
    });
    const { mutateAsync: requestReview } = reviewMutation;
    /** Confirms the recipient before sending a customer review request. */
    const confirmReviewRequest = useCallback(
        (customer: CustomerRow) => {
            confirmRef.current?.open({
                title: t('requestReview'),
                description: t('reviewRequestDescription', {
                    email: customer.email,
                    orders: customer._count.orders,
                    reviewRequests: customer.reviewRequestCount ?? 0,
                }),
                confirmLabel: t('requestReview'),
                errorMessage: t('reviewRequestError'),
                onConfirm: () => requestReview(customer.id),
            });
        },
        [t, requestReview],
    );
    /** Confirms a temporary suspension or restoration of the selected customer's access. */
    const changeAccess = useCallback(
        (customer: CustomerRow) => {
            const deactivated = !customer.deactivatedAt;
            confirmRef.current?.open({
                title: t(deactivated ? 'deactivate' : 'reactivate'),
                description: t(deactivated ? 'deactivateDescription' : 'reactivateDescription', {
                    email: customer.email,
                }),
                confirmLabel: t(deactivated ? 'deactivate' : 'reactivate'),
                errorMessage: t('accessError'),
                destructive: deactivated,
                onConfirm: () => mutateAsync({ id: customer.id, deactivated }),
            });
        },
        [t, mutateAsync],
    );
    const query = useQuery({ queryKey: ['customers'], queryFn: () => getUsers('CUSTOMER') });
    const columns = useMemo<PortalTableColumnDef<CustomerRow>[]>(
        () => [
            ...getCustomerColumns(
                {
                    name: t('name'),
                    email: t('email'),
                    phone: t('phone'),
                    status: t('status'),
                    active: t('active'),
                    closed: t('closed'),
                    noName: t('noName'),
                    createdAt: t('createdAt'),
                    lastVisited: t('lastVisited'),
                    notRecorded: t('notRecorded'),
                    deactivated: t('deactivated'),
                    reviewRequests: t('reviewRequests'),
                    orders: t('orders'),
                    none: t('none'),
                },
                formatDate,
            ),
            {
                id: 'actions',
                header: t('actions'),
                enableSorting: false,
                enableHiding: false,
                cell: ({ row }) =>
                    row.original.closedAt
                        ? null
                        : createElement(CustomerActions, {
                              deactivated: !!row.original.deactivatedAt,
                              disabled: mutation.isPending || reviewMutation.isPending,
                              onChangeAccess: () => changeAccess(row.original),
                              onRequestReview: () => confirmReviewRequest(row.original),
                          }),
            },
        ],
        [
            t,
            formatDate,
            changeAccess,
            mutation.isPending,
            reviewMutation.isPending,
            confirmReviewRequest,
        ],
    );
    return { t, query, columns, confirmRef };
}
