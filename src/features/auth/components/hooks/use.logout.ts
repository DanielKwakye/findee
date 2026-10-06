"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "@/features/auth/utils/auth.client";

/** Manages session termination and its request state. */
export function useLogout() {
    return useMutation({ mutationFn: logout, retry: false });
}
