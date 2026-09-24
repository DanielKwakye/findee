import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
    children: ReactNode;
    className?: string;
};

export default function TypographyBody({ children, className }: Props) {
    return <span className={cn("text-base leading-normal", className)}>{children}</span>;
}
