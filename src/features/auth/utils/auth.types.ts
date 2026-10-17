export type AuthRole = "ADMIN" | "CUSTOMER";

export type AddAdminValues = { name: string; email: string };
export type AddAdminDialogHandle = { open: () => void };
export type AdminRow = { id: string; name: string | null; email: string; mustChangePassword: boolean };
export type ChangeAdminPasswordValues = { password: string; confirmPassword: string };

export type CustomerProfileValues = {
    name: string;
    phone: string;
};

export type CustomerOtpValues = {
    email: string;
    code: string;
};

export type LoginValues = {
    email: string;
    password: string;
};

export type AuthUser = {
    id: string;
    email: string;
    name: string | null;
    role: AuthRole;
};
