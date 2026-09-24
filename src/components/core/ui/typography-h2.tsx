import {ReactNode} from "react";
import {cn} from "@/lib/utils";

type Props = {
    children: ReactNode,
    className?: string
}
export default function TypographyH2({ children, className } : Props) {
    return (
        <h1 className={cn("text-3xl font-bold text-balance tracking-wide", className)}>
            { children }
        </h1>
    )
}
