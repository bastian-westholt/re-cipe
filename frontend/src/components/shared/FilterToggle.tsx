import clsx from "clsx"
import { useState } from "react"
import { useFilterStore } from "../../store/filterStore"

interface FilterToggleProps {
    children: string
}

export default function FilterToggle({ children }: FilterToggleProps) {

    const { isFilterOn, setIsFilterOn } = useFilterStore()

    const toggleContainerClass = clsx(
        " flex items-center w-10 h-6 bg-color-2 rounded-full p-1",
        isFilterOn
            ? "justify-end"
            : "justify-start"
    )

    const togglePointerClass = clsx(
        "w-4 h-full rounded-full",
        isFilterOn
            ? "bg-accent-2"
            : "bg-color-1"
    )

    return (
        <div className="flex items-center justify-between w-full h-12 rounded-2xl border-color-2 border-2 bg-bg text-color-2 p-4 mb-2">
            <p className="font-display">{ children }</p>
            <div onClick={() => setIsFilterOn(!isFilterOn)} className={toggleContainerClass}>
                <div className={togglePointerClass}></div>
            </div>
        </div>
    )
}