"use client";

import { useImperativeHandle, useState, type Ref } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useUserDateTime } from "@/components/platform";
import { toast } from "@/components/core/ui/toast";
import { getTicketDetails } from "@/features/tickets/server/get.ticket.details.action";
import { updateTicket } from "@/features/tickets/server/update.ticket.action";
import type { TicketDialogHandle, TicketUpdateValues } from "@/features/tickets/utils/ticket.types";

/** Manages administrator ticket review, editing, and the dialog lifecycle. */
export function useTicketDetails(ref: Ref<TicketDialogHandle>, audience: "admin" | "customer" = "admin") {
    const t = useTranslations("TicketHistory");
    const formatDate = useUserDateTime();
    const queryClient = useQueryClient();
    const [id, setId] = useState<string | null>(null);
    const query = useQuery({ queryKey: [audience === "admin" ? "admin-tickets" : "customer-tickets", "details", id], queryFn: () => getTicketDetails(id!, audience), enabled: !!id });
    const form = useForm<TicketUpdateValues>({ defaultValues: { status: "PENDING", remarks: "" },
        values: query.data ? { status: query.data.status, remarks: query.data.remarks ?? "" } : undefined });
    const mutation = useMutation({ mutationFn: updateTicket, retry: false,
        /** Refreshes ticket views and closes the editor after saving. */
        async onSuccess(result) {
            toast.add({ title: t(result.notified ? "details.saveSuccess" : "details.notificationWarning"), type: result.notified ? "success" : "warning" });
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["admin-tickets"] }),
                queryClient.invalidateQueries({ queryKey: ["customer-tickets"] }),
            ]);
            setId(null);
        },
    });
    useImperativeHandle(ref, () => ({
        /** Opens the requested ticket and clears previous form feedback. */
        open(ticketId) {
            if (mutation.isPending) return;
            mutation.reset();
            form.reset({ status: "PENDING", remarks: "" });
            setId(ticketId);
        },
    }));

    /** Dismisses the editor while no update is in progress. */
    function changeOpen(open: boolean) { if (!open && !mutation.isPending) setId(null); }

    /** Saves validated handling details for the selected ticket. */
    const submit = form.handleSubmit(values => {
        if (audience !== "admin" || !id || !query.data || mutation.isPending) return;
        mutation.mutate({ ...values, id });
    });

    return { t, formatDate, id, query, form, mutation, changeOpen, submit };
}
