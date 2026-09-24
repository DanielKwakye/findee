import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
    children: ReactNode;
    className?: string;
};

export default function TypographySubtitle({ children, className }: Props) {
    return <p className={cn("text-sm leading-6 text-muted-foreground", className)}>{children}</p>;
}
