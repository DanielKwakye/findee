import { BookOpenIcon, MessageSquareIcon, LayersIcon, ScanQrCodeIcon, TagsIcon } from "lucide-react";

export const navbarMenuItems = [
  { key: "howItWorks", href: "/#how-it-works", icon: ScanQrCodeIcon },
  { key: "pricing", href: "/pricing", icon: TagsIcon },
  { key: "useCases", href: "/use-cases", icon: LayersIcon },
  { key: "contactUs", href: "/tickets", icon: MessageSquareIcon },
  { key: "blog", href: "/blog", icon: BookOpenIcon },
] as const;
