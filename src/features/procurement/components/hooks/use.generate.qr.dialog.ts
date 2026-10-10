"use client";

import {useId, useImperativeHandle, useState} from "react";
import type {Ref} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useTranslations} from "next-intl";
import {toast} from "@/components/core/ui/toast";
import {generateProcurementProducts} from "@/features/procurement/server/generate.procurement.products.action";
import {getQrGenerationError, initialQrQuantities, maxQrGenerationQuantity} from "@/features/procurement/utils/procurement.generation";
import type {GenerateQrDialogHandle, GenerateQrValues} from "@/features/procurement/utils/procurement.types";

/** Manages the generation dialog's internal lifecycle, form, and inventory mutation. */
export function useGenerateQrDialog(ref: Ref<GenerateQrDialogHandle>) {
    const t = useTranslations("procurement.generation");
    const id = useId();
    const [open, setOpen] = useState(false);
    const form = useForm<GenerateQrValues>({defaultValues: initialQrQuantities});
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: generateProcurementProducts,
        retry: false,
        /** Refreshes procurement inventory after a completed generation batch. */
        async onSuccess() {
            toast.add({title: t("success"), type: "success"});
            form.reset(initialQrQuantities);
            setOpen(false);
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["procurement"]}),
                queryClient.invalidateQueries({queryKey: ["products"]}),
            ]);
        },
        onError: () => { toast.add({title: t("serverError"), type: "error"}); },
    });
    useImperativeHandle(ref, () => ({
        /** Opens a fresh generation form. */
        open() {
            form.reset(initialQrQuantities);
            mutation.reset();
            setOpen(true);
        },
    }));

    /** Keeps the dialog available until an in-flight batch has finished. */
    function changeOpen(next: boolean) {
        if (!mutation.isPending) setOpen(next);
    }

    /** Validates the batch and submits the requested sticker quantities. */
    function submit(values: GenerateQrValues) {
        const error = getQrGenerationError(values);
        if (error) {
            form.setError("root", {message: t(error, {max: maxQrGenerationQuantity})});
            return;
        }
        form.clearErrors("root");
        mutation.mutate(values);
    }
    return {t, id, open, changeOpen, form, mutation, submit};
}
