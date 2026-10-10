import {
    ClipboardList,
    Package,
    PackagePlus,
    ShoppingCart,
    type LucideIcon,
} from "lucide-react"

export type PortalInventoryItem = {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: { title: string; url: string }[]
}

export const portalInventoryItems: PortalInventoryItem[] = [
    {
        title: "orders",
        url: "/admin/orders",
        icon: ShoppingCart,
        isActive: true,
        items: [
            { title: "showAll", url: "/admin/orders" },
            { title: "pending", url: "/admin/orders?status=PENDING" },
            { title: "processing", url: "/admin/orders?status=PROCESSING" },
            { title: "outForDelivery", url: "/admin/orders?status=SHIPPED" },
            { title: "delivered", url: "/admin/orders?status=DELIVERED" },
            { title: "canceled", url: "/admin/orders?status=CANCELLED" },
        ],
    },
    { title: "createOrder", url: "/admin/create-order", icon: PackagePlus },
]

export const portalInternalItems = [
    { name: "products", url: "/admin/products", icon: Package },
    { name: "procurements", url: "/admin/procurement", icon: ClipboardList }
]
