import {
    ClipboardList,
    MessageSquare,
    Ticket,
    Package,
    PackagePlus,
    ShoppingCart,
    UserRound,
    Newspaper,
    type LucideIcon,
} from "lucide-react"
import type { OrderStatus } from "@/generated/client"

export type PortalInventoryItem = {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: { title: string; url: string; badgeStatus?: OrderStatus | "all" }[]
}

export const portalInventoryItems: PortalInventoryItem[] = [
    {
        title: "orders",
        url: "/admin/orders",
        icon: ShoppingCart,
        isActive: true,
        items: [
            { title: "showAll", url: "/admin/orders" },
            { title: "pending", url: "/admin/orders?status=PENDING", badgeStatus: "PENDING" },
            { title: "confirmed", url: "/admin/orders?status=CONFIRMED", badgeStatus: "CONFIRMED" },
            { title: "hold", url: "/admin/orders?status=HOLD", badgeStatus: "HOLD" },
            { title: "processing", url: "/admin/orders?status=PROCESSING", badgeStatus: "PROCESSING" },
            { title: "outForDelivery", url: "/admin/orders?status=SHIPPED", badgeStatus: "SHIPPED" },
            { title: "delivered", url: "/admin/orders?status=DELIVERED" },
            { title: "canceled", url: "/admin/orders?status=CANCELLED" },
        ],
    },
    { title: "createOrder", url: "/admin/create-order", icon: PackagePlus },
]

export const portalInternalItems = [
    { name: "products", url: "/admin/products", icon: Package },
    { name: "procurements", url: "/admin/procurement", icon: ClipboardList },
    { name: "tickets", url: "/admin/tickets", icon: MessageSquare },
    { name: "blog", url: "/admin/blog", icon: Newspaper },
]

export const portalCustomerItems: PortalInventoryItem[] = [
    { title: "orders", url: "/customer/orders", icon: ShoppingCart },
    { title: "profile", url: "/customer/profile", icon: UserRound },
    { title: "contactUs", url: "/customer/tickets", icon: MessageSquare },
    { title: "yourTickets", url: "/customer/your-tickets", icon: Ticket },
]
