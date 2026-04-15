import { create } from "zustand";

interface FilterStore {
    isFilterOpen: boolean
    setIsFilterOpen: (isFilterOpen: boolean) => void
    activeFilters: Record<string, string[]>
    setFilter: (key: string, value: string, multiple?: boolean) => void
    clearFilter: (key: string, value?: string, multiple?: boolean) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
    isFilterOpen: false,
    setIsFilterOpen: (isFilterOpen) => set({ isFilterOpen }),
    activeFilters: {},
    setFilter: (key, value, multiple) => set((prev) => ({
        activeFilters: multiple
            ? { ...prev.activeFilters, [key]: prev.activeFilters[key] ? [...prev.activeFilters[key], value] : [value] }
            : { ...prev.activeFilters, [key]: [value] }
    })),
    clearFilter: (key, value, multiple) => set((prev) => {
        if (multiple) {
            const choice = prev.activeFilters[key].filter(v => v !== value)
            if (choice.length < 1) {
                const { [key]: _, ...rest } = prev.activeFilters
                return { activeFilters: rest }
            }
            return { activeFilters: { ...prev.activeFilters, [key]: choice } }
        }
        const { [key]: _, ...rest } = prev.activeFilters
        return { activeFilters: rest }
    }),
}))