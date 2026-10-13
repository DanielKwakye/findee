import { ImageConstants } from "@/lib/image.constants";

export const useCases = [
  { key: "keys", image: ImageConstants.FindeeOnKeyHolder, variant: "Tough" },
  { key: "wallets", image: ImageConstants.FindeeOnWallet, variant: "Everyday" },
  { key: "phones", image: ImageConstants.FindeeOnPhone, variant: "Everyday" },
  { key: "laptops", image: ImageConstants.FindeeOnLaptop, variant: "Everyday" },
  { key: "backpacks", image: ImageConstants.FindeeOnBag, variant: "Fabric" },
  { key: "luggage", image: ImageConstants.FindeeOnBag, variant: "Tough" },
  { key: "waterBottles", image: ImageConstants.FindeeOnBusPass, variant: "Tough" },
  { key: "headphones", image: ImageConstants.FindeeOnPhone, variant: "Everyday" },
  { key: "glassesCases", image: ImageConstants.FindeeOnWallet, variant: "Everyday" },
  { key: "jackets", image: ImageConstants.FindeeOnBag, variant: "Fabric" },
  { key: "schoolUniforms", image: ImageConstants.FindeeOnBusPass, variant: "Fabric" },
  { key: "kidsLunchboxes", image: ImageConstants.FindeeOnBag, variant: "Tough" },
  { key: "kidsClothing", image: ImageConstants.FindeeOnBusPass, variant: "Fabric" },
  { key: "supportClothing", image: ImageConstants.FindeeOnBag, variant: "Fabric" },
  { key: "mobilityAids", image: ImageConstants.FindeeOnKeyHolder, variant: "Tough" },
  { key: "tools", image: ImageConstants.FindeeOnLaptop2, variant: "Tough" },
  { key: "sportsGear", image: ImageConstants.FindeeOnBag, variant: "Tough" },
  { key: "cameraCases", image: ImageConstants.FindeeOnLaptop, variant: "Fabric" },
] as const;
