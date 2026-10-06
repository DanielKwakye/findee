"use client";

import {useImperativeHandle, useRef, useState} from "react";
import type {Ref} from "react";
import type {PortalConfirmDialogHandle, PortalConfirmDialogOptions} from "@/components/platform/utils/portal.confirm.dialog.types";

/** Manages confirmation requests, pending actions, and dialog feedback internally. */
export function usePortalConfirmDialog(ref: Ref<PortalConfirmDialogHandle>) {
    const [options, setOptions] = useState<PortalConfirmDialogOptions | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pending = useRef(false);
    useImperativeHandle(ref, () => ({
        /** Opens a confirmation request without interrupting an active action. */
        open(next) {
            if (pending.current) return;
            setError(null);
            setOptions(next);
        },
    }));

    /** Dismisses idle confirmation requests. */
    function changeOpen(open: boolean) {
        if (!open && !pending.current) setOptions(null);
    }

    /** Runs the confirmed action and keeps failures available for retry. */
    async function confirm() {
        if (!options || pending.current) return;
        pending.current = true;
        setIsPending(true);
        setError(null);
        try {
            await options.onConfirm();
            setOptions(null);
        } catch {
            setError(options.errorMessage);
        } finally {
            pending.current = false;
            setIsPending(false);
        }
    }
    return {options, isPending, error, changeOpen, confirm};
}
