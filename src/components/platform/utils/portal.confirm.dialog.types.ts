export type PortalConfirmDialogOptions = {
    title: string;
    description: string;
    errorMessage: string;
    getErrorMessage?: (error: unknown) => string;
    confirmLabel?: string;
    destructive?: boolean;
    confirmationText?: string;
    confirmationLabel?: string;
    onConfirm: () => Promise<unknown> | void;
};

export type PortalConfirmDialogHandle = {
    open: (options: PortalConfirmDialogOptions) => void;
};
