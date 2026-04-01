import clsx from "clsx"
/* import { getTypeBG } from "../../utils/styles"
import { useSearchParams } from "react-router-dom" */

export function SkeletonBlock({ delay, width, height="small" }: { delay: number, width: string, height?: string }) {

    /* const [searchParams] = useSearchParams()
    const type = searchParams.get('type') */
    
    const wrapperClass = clsx(
        width,
        `h-${height === "big" ? "10" : "5"} my-1`,
        "relative overflow-hidden",
        /* type === 'original' ? "bg-accent-2/50" : "bg-accent-1/50", */
        "bg-gray-300/50",
        "rounded-2xl"
    )

    const shimmerClass = clsx(
        "animate-shimmer inset-0 absolute",
        "bg-linear-to-r from-transparent",
        "via-white/60 to-transparent"
    )

    return(
        <div className={wrapperClass}>
            <div className={shimmerClass} style={{ animationDelay: `${delay}s` }}></div>
        </div>
    )
}

export function SkeletonLines({ count, height="small" }: { count:number, height?:string }) {

    const widths = ["w-full", "w-3/4", "w-1/2"]

    return Array.from({ length: count }).map((_, i) => (
        <SkeletonBlock key={i} delay={i * 0.15} width={widths[i % widths.length]} height={height}/>
    ))
}