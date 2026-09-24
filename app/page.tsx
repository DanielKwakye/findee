import { MobileHero, MobileNavbar, WebHero, WebNavbar } from "@/components/platform";

/** Renders the home page canvas and its shared navigation. */
export default function Home() {
  return (
    <>
      <MobileNavbar />
      <WebNavbar />
      <main
        className="relative overflow-hidden"
        style={{ backgroundColor: "color-mix(in oklch, var(--chart-5) 22%, var(--foreground))" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in oklch, var(--chart-2) 40%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--chart-2) 40%, transparent) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <MobileHero />
        <WebHero />
      </main>
    </>
  );
}
