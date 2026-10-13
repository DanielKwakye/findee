import { LockKeyhole, ShieldCheck, Users } from "lucide-react";
import { ImageConstants } from "@/lib/image.constants";

export const howItWorksSteps = [
  { key: "stick", image: ImageConstants.FindeeOnLaptop2, cardClassName: "bg-chart-1/10", numberClassName: "bg-chart-1/20 text-primary", domeClassName: "bg-chart-1/20", imageClassName: "origin-top-right -translate-y-[8%] -rotate-10 scale-[1.4667] object-top-right" },
  { key: "scan", image: ImageConstants.ScanQRCode, cardClassName: "bg-success/5", numberClassName: "bg-success/10 text-success", domeClassName: "bg-success/10", imageClassName: "origin-top-right scale-[1.8] object-top-right" },
  { key: "return", image: ImageConstants.NotifyItemFound, cardClassName: "bg-destructive/5", numberClassName: "bg-destructive/10 text-destructive", domeClassName: "bg-destructive/10", imageClassName: "origin-top scale-[1.3333] object-top" },
] as const;

export const howItWorksTrustCues = [
  { key: "secure", icon: LockKeyhole },
  { key: "trusted", icon: ShieldCheck },
  { key: "noApp", icon: Users },
] as const;
