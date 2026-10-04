import {
    ClipboardList,
    Package,
    PackagePlus,
    Settings2,
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
        url: "#",
        icon: ShoppingCart,
        isActive: true,
        items: [
            { title: "showAll", url: "#" },
            { title: "pending", url: "#" },
            { title: "processing", url: "#" },
            { title: "outForDelivery", url: "#" },
            { title: "delivered", url: "#" },
            { title: "canceled", url: "#" },
        ],
    },
    { title: "createOrder", url: "#", icon: PackagePlus },
    {
        title: "products",
        url: "#",
        icon: Package,
        items: [
            { title: "viewProducts", url: "#" },
            { title: "addNew", url: "#" },
        ],
    },
]

export const portalInternalItems = [
    { name: "procurements", url: "/admin/procurement", icon: ClipboardList },
    { name: "settings", url: "#", icon: Settings2 },
]
