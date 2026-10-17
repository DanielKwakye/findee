"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getUsers } from "@/features/users/server/get.users.action";
import { getAdminColumns } from "@/features/users/utils/admin.columns";

/** Manages administrator records and the management table's display columns. */
export function useAdminsTable() {
    const t = useTranslations("Admins");
    const query = useQuery({ queryKey: ["admins"], queryFn: () => getUsers("ADMIN") });
    const columns = useMemo(() => getAdminColumns({
        name: t("name"), email: t("email"), status: t("status"),
        pending: t("pending"), ready: t("ready"), noName: t("noName"),
    }), [t]);
    return { t, query, columns };
}
