import {ReactNode} from "react";
import {cn} from "@/lib/utils";

type Props = {
    children: ReactNode,
    className?: string
}
export default function TypographyH1({ children, className } : Props) {
    return (
        <h1 className={cn("text-4xl font-bold text-balance", className)}>
            { children }
        </h1>
    )
}
