"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

/** Manages customer navigation and session feedback after sign-in. */
export function useCustomerSignIn() {
    const router = useRouter();
    const queryClient = useQueryClient();

    /** Opens the customer's account after email verification. */
    function onVerified() {
        void queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
        router.replace("/customer");
        router.refresh();
    }

    return { onVerified };
}
