import Image from "next/image";
import TypographyBody from "@/components/core/ui/typography-body";
import { cn } from "@/lib/utils";

type AppIconProps = {
  brightness?: "dark" | "light";
  size?: "default" | "compact";
  className?: string;
};

/** Renders the shared Findee brand mark across platform layouts. */
export default function AppIcon({ brightness = "dark", size = "default", className }: AppIconProps) {
  return (
    <span className={cn("inline-flex items-center", size === "compact" ? "gap-2" : "gap-2.5", className)}>
      <Image
        src="/images/png/app-icon.png"
        alt=""
        width={36}
        height={39}
        className={cn("w-auto shrink-0", size === "compact" ? "h-7" : "h-9")}
        priority
      />
      <TypographyBody
        className={cn(
          "font-bold tracking-tight transition-colors duration-500 ease-in-out",
          size === "compact" ? "text-xl" : "text-2xl",
          brightness === "light" ? "text-background" : "text-foreground",
        )}
      >
        Findee
      </TypographyBody>
    </span>
  );
}
