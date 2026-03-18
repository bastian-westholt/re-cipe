import clsx from 'clsx'
import { SlidersHorizontalIcon } from 'hugeicons-react'

export default function FilterButton() {

    const filterButtonClass = clsx(
        "flex items-center justify-center",
        "w-11 h-11 bg-surface rounded-2xl",
        "fixed right-5 top-5 z-11"
    )

    return (
        <div className={filterButtonClass}>
            <SlidersHorizontalIcon size={18} className="text-color-2"/>
        </div>
    )
}