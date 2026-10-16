import { redirect } from "next/navigation";

/** Opens the customer's orders section on entering the portal. */
export default function CustomerPage() {
    redirect("/customer/orders");
}
