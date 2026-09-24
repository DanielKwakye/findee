import {ReactNode} from "react";
import {cn} from "@/lib/utils";

type Props = {
    children: ReactNode,
    className?: string
}
export default function TypographyH4({ children, className } : Props) {
    return (
        <h1 className={cn("text-xl font-bold text-balance", className)}>
            { children }
        </h1>
    )
}
