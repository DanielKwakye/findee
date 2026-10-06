export type PortalConfirmDialogOptions = {
    title: string;
    description: string;
    errorMessage: string;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => Promise<unknown> | void;
};

export type PortalConfirmDialogHandle = {
    open: (options: PortalConfirmDialogOptions) => void;
};
