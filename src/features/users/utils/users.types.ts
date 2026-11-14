export type AddAdminValues = { name: string; email: string; departments: string[] };
export type AddAdminDialogHandle = { open: () => void };
export type UpdateAdminDetailsValues = { id: string; name: string; departments: string[] };
export type UpdateAdminDetailsDialogHandle = { open: (admin: AdminRow) => void };
export type AdminRow = {
    id: string;
    name: string | null;
    email: string;
    mustChangePassword: boolean;
    departments: string[];
    deactivatedAt: Date | null;
    lastPortalVisitedAt?: Date | null;
};
export type CustomerRow = {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    closedAt: Date | null;
    deactivatedAt: Date | null;
    createdAt: Date;
    lastPortalVisitedAt: Date | null;
    reviewRequestCount: number | null;
    _count: { orders: number };
};
