'use client';

import type { Ref } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/core/ui/dialog';
import { Button } from '@/components/core/ui/button';
import { Input } from '@/components/core/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/core/ui/field';
import TypographyBody from '@/components/core/ui/typography-body';
import { useUpdateAdminDetailsDialog } from '@/features/users/components/hooks/use.update.admin.details.dialog';
import type { UpdateAdminDetailsDialogHandle } from '@/features/users/utils/users.types';
import { Checkbox } from '@/components/core/ui/checkbox';
import { UserDepartments } from '@/features/users/utils/users.constants';

/** Presents the administrator display name form. */
export default function UpdateAdminDetailsDialog({
    ref,
    isDirector,
}: {
    ref: Ref<UpdateAdminDetailsDialogHandle>;
    isDirector: boolean;
}) {
    const {
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
    } = useUpdateAdminDetailsDialog(ref);
    const { errors } = form.formState;
    return (
        <Dialog open={open} onOpenChange={changeOpen}>
            <DialogContent
                showCloseButton={false}
                className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle>
                        <TypographyBody className="font-medium">{t('title')}</TypographyBody>
                    </DialogTitle>
                    <DialogDescription>
                        <TypographyBody className="text-sm text-muted-foreground">
                            {t('description')}
                        </TypographyBody>
                    </DialogDescription>
                </DialogHeader>
                <form
                    noValidate
                    onSubmit={submit}
                    aria-busy={mutation.isPending}
                    className="space-y-6"
                >
                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="update-admin-name">
                            <TypographyBody className="text-sm">{t('name')}</TypographyBody>
                        </FieldLabel>
                        <Input
                            id="update-admin-name"
                            {...nameInput}
                            disabled={mutation.isPending}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'update-admin-name-error' : undefined}
                        />
                        {errors.name && (
                            <FieldError id="update-admin-name-error">
                                <TypographyBody className="text-sm">
                                    {errors.name.message}
                                </TypographyBody>
                            </FieldError>
                        )}
                    </Field>
                    {isDirector && (
                        <fieldset disabled={mutation.isPending} className="space-y-3">
                            <legend>
                                <TypographyBody className="text-sm font-medium">
                                    {tDepartments('departments')}
                                </TypographyBody>
                            </legend>
                            {Object.values(UserDepartments).map((department) => (
                                <Field key={department} orientation="horizontal">
                                    <Checkbox
                                        id={`update-admin-department-${department}`}
                                        name="departments"
                                        value={department}
                                        checked={departments.includes(department)}
                                        onCheckedChange={(checked) =>
                                            changeDepartment(department, checked)
                                        }
                                    />
                                    <FieldLabel htmlFor={`update-admin-department-${department}`}>
                                        <TypographyBody className="text-sm">
                                            {tDepartments(`departmentOptions.${department}`)}
                                        </TypographyBody>
                                    </FieldLabel>
                                </Field>
                            ))}
                        </fieldset>
                    )}
                    {mutation.isError && (
                        <div role="alert">
                            <TypographyBody className="text-sm text-destructive">
                                {t('error')}
                            </TypographyBody>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={mutation.isPending}
                            onClick={() => changeOpen(false)}
                        >
                            <TypographyBody className="text-sm">{t('cancel')}</TypographyBody>
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            <TypographyBody className="text-sm">
                                {t(mutation.isPending ? 'saving' : 'save')}
                            </TypographyBody>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
