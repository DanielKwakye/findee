import { Bike, Camera, KeyRound, Laptop, Luggage, PawPrint, Wallet } from "lucide-react";

export const webHeroTrustedItems = [
  { labelKey: "luggage", icon: Luggage },
  { labelKey: "laptops", icon: Laptop },
  { labelKey: "keys", icon: KeyRound },
  { labelKey: "wallets", icon: Wallet },
  { labelKey: "bikes", icon: Bike },
  { labelKey: "cameras", icon: Camera },
  { labelKey: "pets", icon: PawPrint },
] as const;
