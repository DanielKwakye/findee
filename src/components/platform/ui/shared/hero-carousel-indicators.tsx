import { heroCarouselItems } from "@/components/platform/data/hero.carousel.items";
import { cn } from "@/lib/utils";

/** Shows which hero carousel slide is selected. */
export default function HeroCarouselIndicators({ selectedIndex }: { selectedIndex: number }) {
  return (
    <div aria-hidden="true" className="mt-4 flex items-center justify-center gap-2">
      {heroCarouselItems.map((item, index) => (
        <span
          key={item.titleKey}
          className={cn("size-2 rounded-full", index === selectedIndex ? "bg-chart-1" : "bg-primary-foreground/35")}
        />
      ))}
    </div>
  );
}
