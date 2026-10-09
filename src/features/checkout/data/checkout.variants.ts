import { ImageConstants } from "@/lib/image.constants";

export const checkoutVariants = [
    { id: "Everyday", key: "everyday", image: ImageConstants.FindeeOnLaptop },
    { id: "Tough", key: "tough", image: ImageConstants.FindeeOnKeyHolder },
    { id: "Fabric", key: "fabric", image: ImageConstants.FindeeOnBag },
] as const;

export type CheckoutVariant = typeof checkoutVariants[number]["id"];
