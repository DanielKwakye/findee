import { CreditCard, Headphones, Package, ShieldCheck, ShoppingCart, Smartphone } from "lucide-react";

export const faqItems = [
  { key: "howItWorks", icon: ShoppingCart },
  { key: "privacy", icon: ShieldCheck },
  { key: "notifications", icon: Smartphone },
  { key: "items", icon: Package },
  { key: "subscription", icon: CreditCard },
  { key: "help", icon: Headphones },
] as const;
