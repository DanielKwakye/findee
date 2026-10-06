import {ReactNode} from "react";
import {requireCustomer} from "@/features/auth/server/auth.session";

/** Provides the authorized customer's portal layout. */
export default async function CustomerLayout({ children }: { children: ReactNode }) {
    await requireCustomer();
    return (
        <>{children}</>
    )
}
