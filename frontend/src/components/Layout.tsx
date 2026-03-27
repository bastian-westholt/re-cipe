import { useState, createContext } from "react"
import { Outlet } from "react-router-dom"
import BottomNav from "./BottomNav"

interface FilterSheetContextValues {
    activeFilters: Record<string, string[]>
    setFilter: (key: string, value: string, multiple?: boolean) => void
    clearFilter: (key: string, value?: string, multiple?: boolean) => void
}

const FilterSheetContext = createContext<FilterSheetContextValues>({
    activeFilters: {},
    setFilter: () => {},
    clearFilter: () => {}
})

export default function Layout() {

    const [ activeFilters, setActiveFilters ] = useState<Record<string, string[]>>({})

    function setFilter(key: string, value: string, multiple?: boolean) {
        if (multiple) {
            setActiveFilters(prev => ({
                ...prev,
                [key] : prev[key] ? [...prev[key], value] : [value]
            }))
        } else {
            setActiveFilters(prev => ({
                ...prev,
                [key]: [value]
            }))
        }
    }

    function clearFilter(key: string, value?: string, multiple?: boolean) {
        multiple 
            ? 
                setActiveFilters(prev => {
                    const choice = prev[key].filter(v => v !== value)
                    if (choice.length < 1) {
                        const { [key]: _, ...rest } = prev
                        return rest
                    }
                    return { ...prev, [key]: choice }
                    
                })
            :
                setActiveFilters(prev => {
                    const { [key]: _, ...rest } = prev
                    return rest
                })

    }


    return (
        <FilterSheetContext.Provider value={{ activeFilters, setFilter, clearFilter }}>
            <>
                <Outlet />
                <BottomNav/>
            </>
        </FilterSheetContext.Provider>
    )
}

export { FilterSheetContext }