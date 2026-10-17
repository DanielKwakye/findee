import { isValidEmail, normalizeEmail } from "@/features/auth/utils/auth.validation";
import type { TicketQuery, TicketValues, TicketUpdate } from "@/features/tickets/utils/ticket.types";
import { ticketStatuses } from "@/features/tickets/data/ticket.statuses";

/** Validates ticket identifiers at server operation boundaries. */
export function validateTicketId(id: string) {
    if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) throw new Error("invalidTicketId");
}

/** Validates changes to internal ticket handling details. */
export function validateTicketUpdate(values: TicketUpdate) {
    if (!values || !ticketStatuses.some(status => status === values.status)
        || typeof values.remarks !== "string" || values.remarks.trim().length > 5000) throw new Error("invalidTicketUpdate");
    validateTicketId(values.id);
    return { status: values.status, remarks: values.remarks.trim() || null };
}

/** Validates pagination and limits ticket searches and sorting to supported fields. */
export function validateTicketQuery(params: TicketQuery) {
    if (!params || !Number.isSafeInteger(params.page) || params.page < 1
        || !Number.isSafeInteger(params.pageSize) || params.pageSize < 1 || params.pageSize > 100
        || typeof params.search !== "string") throw new Error("invalidTicketQuery");
    if (params.status !== undefined && params.status !== "all" && !ticketStatuses.some(status => status === params.status)) {
        throw new Error("invalidTicketQuery");
    }
    return {
        search: params.search.trim().slice(0, 255),
        sortBy: params.sortBy === "code" || params.sortBy === "status" ? params.sortBy : "createdAt" as const,
        direction: params.direction === "asc" ? "asc" as const : "desc" as const,
    };
}

/** Validates and normalizes customer-submitted support requests. */
export function validateTicketValues(values: TicketValues) {
    if (!values || typeof values.name !== "string" || !values.name.trim() || values.name.trim().length > 100
        || typeof values.email !== "string" || !isValidEmail(values.email)
        || typeof values.message !== "string" || !values.message.trim() || values.message.trim().length > 5000) {
        throw new Error("invalidTicket");
    }
    return { name: values.name.trim(), email: normalizeEmail(values.email), message: values.message.trim() };
}
