import { Bike, Camera, KeyRound, Laptop, Luggage, PawPrint, Wallet } from "lucide-react";

export const webHeroTrustedItems = [
  { labelKey: "luggage", icon: Luggage, variant: "Tough" },
  { labelKey: "laptops", icon: Laptop, variant: "Everyday" },
  { labelKey: "keys", icon: KeyRound, variant: "Tough" },
  { labelKey: "wallets", icon: Wallet, variant: "Everyday" },
  { labelKey: "bikes", icon: Bike, variant: "Tough" },
  { labelKey: "cameras", icon: Camera, variant: "Everyday" },
  { labelKey: "pets", icon: PawPrint, variant: "Tough" },
] as const;
