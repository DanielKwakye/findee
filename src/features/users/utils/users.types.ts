export type AddAdminValues = { name: string; email: string };
export type AddAdminDialogHandle = { open: () => void };
export type AdminRow = { id: string; name: string | null; email: string; mustChangePassword: boolean };
export type CustomerRow = { id: string; name: string | null; email: string; phone: string | null; closedAt: Date | null; deactivatedAt: Date | null; createdAt: Date; lastPortalVisitedAt: Date | null };
