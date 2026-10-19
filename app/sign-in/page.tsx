import { CustomerSignIn } from "@/features/auth/components/ui/customer-sign-in";
import type { Metadata } from "next";
import messages from "@/translations/en.json";

export const metadata: Metadata = { title: messages.PageMetadata.titles.signIn };

/** Presents email verification sign-in for customers. */
export default function CustomerSignInPage() {
    return <CustomerSignIn />;
}
