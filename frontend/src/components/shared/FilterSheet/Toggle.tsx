import clsx from "clsx"
import { useFilterStore } from "../../../store/filterStore"
import { getTypeBG } from "../../../utils/styles"
import { useSearchParams } from "react-router-dom"

interface FilterToggleProps {
    children: string
    filterKey: string
}

export default function FilterToggle({ children, filterKey }: FilterToggleProps) {

    // Context
    const { activeFilters, setFilter, clearFilter } = useFilterStore()
    
    // Data
    const [searchParams] = useSearchParams()
    const type = searchParams.get('type') ?? "original"

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
            ? getTypeBG(type)
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