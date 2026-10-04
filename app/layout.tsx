import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono, Noto_Sans, DM_Sans } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import {TooltipProvider} from "@/components/core/ui/tooltip";
import {ReactNode} from "react";

const notoSansHeading = Noto_Sans({subsets:['latin'],variable:'--font-heading'});

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Findee Recovery System",
  description: "Recover your lost items in the easiest way possible",
};

/** Provides the shared document layout and translations to app pages. */
export default function RootLayout({ children }: { children: ReactNode } ) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", dmSans.variable, notoSansHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
