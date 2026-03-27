import clsx from "clsx"
import { FilterSheetContext } from "../../Layout"
import { useContext } from "react"

interface FilterToggleProps {
    children: string
    filterKey: string
}

export default function FilterToggle({ children, filterKey }: FilterToggleProps) {

    // Context
    const { activeFilters, setFilter, clearFilter } = useContext(FilterSheetContext)

    // Derived
    const isFilterActive = filterKey in activeFilters

    // Styles
    const toggleContainerClass = clsx(
        " flex items-center w-10 h-6 bg-color-2 rounded-full p-1",
        isFilterActive
            ? "justify-end"
            : "justify-start"
    )

    const togglePointerClass = clsx(
        "w-4 h-full rounded-full",
        isFilterActive
            ? "bg-accent-2"
            : "bg-color-1"
    )

    return (
        <div className="flex items-center justify-between w-full h-12 rounded-2xl border-color-2 border-2 bg-bg text-color-2 p-4 mb-2">
            <p className="font-display">{ children }</p>
            <div onClick={() => isFilterActive ? clearFilter(filterKey) : setFilter(filterKey, "true")} className={toggleContainerClass}>
                <div className={togglePointerClass}></div>
            </div>
        </div>
    )
}