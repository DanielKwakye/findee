"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import { cn } from "@/lib/utils";

type Props = {
    steps: readonly { id: string; label: string }[];
    currentIndex: number;
    onBack: () => void;
    onContinue: () => void;
    continueDisabled?: boolean;
    children: ReactNode;
    introduction?: ReactNode;
    finalAction?: ReactNode;
    scrollContent?: boolean;
};

/** Presents a reusable segmented step flow with content and navigation controls. */
export function Stepper({ steps, currentIndex, onBack, onContinue, continueDisabled = false, children, introduction, finalAction, scrollContent = false }: Props) {
    const t = useTranslations("Stepper");

    return (
        <div className="w-full max-w-5xl space-y-4 sm:space-y-6 xl:max-w-3xl">
            <div className="space-y-3 sm:space-y-4">
                <ol aria-label={t("progress")} className="flex gap-2 sm:gap-3">
                    {steps.map((step, index) => (
                        <li key={step.id} aria-current={index === currentIndex ? "step" : undefined}
                            className={cn("h-2 flex-1 rounded-full", index <= currentIndex ? "bg-primary" : "bg-muted")}>
                            <TypographyBody className="sr-only">{step.label}</TypographyBody>
                        </li>
                    ))}
                </ol>
                <div aria-live="polite">
                    <TypographyBody className="text-sm text-muted-foreground sm:text-base xl:text-sm">
                        {t("status", { current: currentIndex + 1, total: steps.length })}
                    </TypographyBody>
                </div>
            </div>
            <div className={cn("grid gap-4 sm:gap-6", introduction && "xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:gap-8")}>
                {introduction && <div className="space-y-4 xl:space-y-6 xl:pr-6">{introduction}</div>}
                <div className={cn("space-y-4 sm:space-y-6", introduction && "xl:border-l xl:border-border xl:pl-8")}>
                    {scrollContent ? (
                        <div className="xl:max-h-[calc(100svh-18rem)] xl:overflow-y-auto xl:px-1 xl:py-1">
                            {children}
                        </div>
                    ) : children}
                    <div className="flex justify-between gap-4">
                <Button type="button" variant="secondary" size="lg" disabled={currentIndex === 0} onClick={() => onBack()}>
                    <TypographyBody className="text-sm sm:text-base xl:text-sm">{t("back")}</TypographyBody>
                </Button>
                {currentIndex === steps.length - 1 && finalAction ? finalAction : <Button type="button" size="lg" disabled={continueDisabled || currentIndex === steps.length - 1} onClick={() => onContinue()}>
                    <TypographyBody className="text-sm sm:text-base xl:text-sm">{t("continue")}</TypographyBody>
                    <ArrowRight aria-hidden="true" data-icon="inline-end" />
                </Button>}
                    </div>
                </div>
            </div>
        </div>
    );
}
