'use client';

import { useImperativeHandle, useState, type Ref } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { updateAdminDetails } from '@/features/users/server/update.admin.details.action';
import type {
    UpdateAdminDetailsDialogHandle,
    UpdateAdminDetailsValues,
} from '@/features/users/utils/users.types';

/** Manages the administrator name form and dialog lifecycle. */
export function useUpdateAdminDetailsDialog(ref: Ref<UpdateAdminDetailsDialogHandle>) {
    const t = useTranslations('Admins.updateDetailsForm');
    const tDepartments = useTranslations('PortalTeamSwitcher.addForm');
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const form = useForm<UpdateAdminDetailsValues>({
        defaultValues: { id: '', name: '', departments: [] },
    });
    const departments = useWatch({ control: form.control, name: 'departments' });
    /** Updates department membership in the administrator details form. */
    function changeDepartment(department: string, checked: boolean) {
        const selected = form.getValues('departments');
        form.setValue(
            'departments',
            checked
                ? [...new Set([...selected, department])]
                : selected.filter((value) => value !== department),
            { shouldDirty: true },
        );
    }
    const mutation = useMutation({
        mutationFn: updateAdminDetails,
        retry: false,
        /** Refreshes administrator names after a successful update. */
        onSuccess() {
            setOpen(false);
            void queryClient.invalidateQueries({ queryKey: ['admins'] });
            router.refresh();
        },
    });
    useImperativeHandle(ref, () => ({
        /** Opens the form with the selected administrator's name. */
        open(admin) {
            if (mutation.isPending) return;
            form.reset({ id: admin.id, name: admin.name ?? '', departments: admin.departments });
            mutation.reset();
            setOpen(true);
        },
    }));
    /** Closes the form when no update is in progress. */
    function changeOpen(nextOpen: boolean) {
        if (!mutation.isPending) setOpen(nextOpen);
    }
    const nameInput = form.register('name', {
        maxLength: { value: 100, message: t('nameInvalid') },
    });
    /** Saves the validated administrator name. */
    const submit = form.handleSubmit((values) => {
        if (!mutation.isPending) mutation.mutate(values);
    });
    return {
        t,
        tDepartments,
        open,
        changeOpen,
        form,
        nameInput,
        mutation,
        submit,
        departments,
        changeDepartment,
    };
}
