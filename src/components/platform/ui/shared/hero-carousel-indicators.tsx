import { heroCarouselItems } from "@/components/platform/data/hero.carousel.items";
import { cn } from "@/lib/utils";

/** Shows which hero carousel slide is selected. */
export default function HeroCarouselIndicators({ selectedIndex, count = heroCarouselItems.length, className, inactiveClassName = "bg-primary-foreground/35" }: { selectedIndex: number; count?: number; className?: string; inactiveClassName?: string }) {
  return (
    <div aria-hidden="true" className={cn("mt-4 flex items-center justify-center gap-2", className)}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn("size-2 rounded-full", index === selectedIndex ? "bg-chart-1" : inactiveClassName)}
        />
      ))}
    </div>
  );
}
