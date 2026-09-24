import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
    children: ReactNode;
    className?: string;
};

export default function TypographyParagraph({ children, className }: Props) {
    return <p className={cn("text-base leading-7", className)}>{children}</p>;
}
