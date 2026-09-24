import {ReactNode} from "react";
import {cn} from "@/lib/utils";

type Props = {
    children: ReactNode,
    className?: string
}
export default function TypographyH3({ children, className } : Props) {
    return (
        <h1 className={cn("text-2xl font-bold tracking-wide text-balance", className)}>
            { children }
        </h1>
    )
}
