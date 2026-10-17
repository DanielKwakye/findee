export type AuthRole = "ADMIN" | "CUSTOMER";

export type ChangeAdminPasswordValues = { password: string; confirmPassword: string };

export type CustomerProfileValues = {
    name: string;
    phone: string;
};

export type CustomerOtpValues = {
    email: string;
    code: string;
    turnstileToken?: string;
};

export type LoginValues = {
    email: string;
    password: string;
    turnstileToken?: string;
};

export type TurnstileCheckProps = {
    action: "admin-login" | "customer-otp";
    onToken: (token: string) => void;
    resetKey: number;
};

export type TurnstileApi = {
    render: (container: HTMLElement, options: Record<string, unknown>) => string;
    remove: (widget: string) => void;
};

export type AuthUser = {
    id: string;
    email: string;
    name: string | null;
    role: AuthRole;
};
