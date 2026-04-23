import type { ReactNode } from "react"
import { useRef, useState } from "react"

interface CarouselProps {
    children: ReactNode
    count: number
}

export default function Carousel({ children, count }: CarouselProps) {

    const [ activeIndex, setActiveIndex ] = useState<number>(0)

    const scrollRef = useRef<HTMLDivElement>(null)

    function handleScroll() {
        if (!scrollRef.current) return
        const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth)
        setActiveIndex(index)
    }

    return (
        <div>
            <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 py-2">
                {children}
            </div>
            <div className="flex justify-center gap-2 mt-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 border-2 border-border ${i === activeIndex ? 'bg-primary' : 'bg-transparent'}`} />
                ))}
            </div>
        </div>
    )
}
