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
        <MobileHero />
        <WebHero />
      </main>
    </>
  );
}
