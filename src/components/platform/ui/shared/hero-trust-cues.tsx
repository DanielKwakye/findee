import { useTranslations } from "next-intl";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import TypographyBody from "@/components/core/ui/typography-body";
import { cn } from "@/lib/utils";

/** Shows the shared security and trust cues in the hero. */
export default function HeroTrustCues({ className }: { className?: string }) {
  const t = useTranslations("Hero");

  return (
    <div className={cn("flex items-center justify-center gap-4 text-primary-foreground/75 xl:justify-start", className)}>
      <div className="flex items-center gap-1.5">
        <LockKeyhole aria-hidden="true" className="size-3.5 text-chart-2 xl:size-4" />
        <TypographyBody className="text-[8px] font-semibold tracking-wide uppercase xl:text-[10px] xl:font-normal xl:tracking-normal">
          {t("secured")}
        </TypographyBody>
      </div>
      <span aria-hidden="true" className="h-3.5 w-px bg-primary-foreground/35 xl:size-1 xl:rounded-full xl:bg-primary-foreground/65" />
      <div className="flex items-center gap-1.5">
        <ShieldCheck aria-hidden="true" className="size-3.5 text-chart-2 xl:size-4" />
        <TypographyBody className="text-[8px] font-semibold tracking-wide uppercase xl:text-[10px] xl:font-normal xl:tracking-normal">
          {t("trusted")}
        </TypographyBody>
      </div>
    </div>
  );
}
