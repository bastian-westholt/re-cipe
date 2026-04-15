import clsx from "clsx";
import { useSearchParams } from "react-router-dom";
import { useRecipesStore } from "../../../store/recipesStore";
import { useTranslation } from "react-i18next"
import { useFilterStore } from "../../../store/filterStore";
import { useState } from "react";
import type { Recipe } from "../../../types/recipe";
import { selectionFilter } from "../../../utils/filter";
import { getTypeBG } from "../../../utils/styles";

interface FilterSelectionProps {
    children: React.ReactNode
    filterKey: string
    bilingual?: boolean
    multiple?: boolean
}

export default function FilterSelection({ children, filterKey, bilingual, multiple }: FilterSelectionProps) {

    // — Context
    const { activeFilters, setFilter, clearFilter } = useFilterStore()

    // — State
    const [isOpen, setIsOpen] = useState(false)

    // — Data
    const { i18n } = useTranslation()
    const currentLang = i18n.language
    const [searchParams] = useSearchParams()
    const type = searchParams.get('type') ?? "original"
    const { recipes } = useRecipesStore()

    // — Derived
    const isFilterActive = filterKey in activeFilters
    const options = selectionFilter(recipes, type, filterKey, bilingual ? currentLang : undefined)

    function handleFilterLabel() {
        if (activeFilters[filterKey]?.length > 1) {
            return `${activeFilters[filterKey][0]} +`
        } else if (activeFilters[filterKey]?.length === 1) {
            return activeFilters[filterKey]
        } else {
            return "—"
        }
    }

    const activeLabel = handleFilterLabel()

    // — Styles
    const checkboxClass = (isActive: boolean) => clsx(
        "w-5 h-5 rounded border-2 border-color-2 flex items-center justify-center flex-shrink-0",
        isActive ? getTypeBG(type) : "bg-bg"
    )

    const containerClass = clsx(
        "w-full mb-2 border-2 border-color-2 rounded-2xl overflow-hidden",
        isOpen ? "max-h-64" : "max-h-12",
        "transition-all duration-200"
    )

    return (
        <div className={containerClass}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full h-12 bg-bg text-color-2 px-4 cursor-pointer"
            >
                <p className="font-display">{children}</p>
                <span className="font-display text-sm text-muted pr-4">{activeLabel}</span>
            </div>

            <div className="overflow-y-auto max-h-48">
                {options.map(option => {
                    const value = option as string
                    const isActive = activeFilters[filterKey]?.includes(value)  
                    return (
                        <div
                            key={value}
                            onClick={() => isActive ? clearFilter(filterKey, value, multiple) : setFilter(filterKey, value, multiple)}
                            className="flex items-center justify-between px-4 py-3 cursor-pointer odd:bg-white even:bg-surface"
                        >
                            <span className="font-display text-sm">{value}</span>
                            <div className={checkboxClass(isActive)} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}