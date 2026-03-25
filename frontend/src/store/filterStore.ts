import { create } from "zustand";

interface FilterStore {
    isFilterOpen: boolean
    setIsFilterOpen: (isFilterOpen: boolean) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
    isFilterOpen: false,
    setIsFilterOpen: (isFilterOpen) => set({ isFilterOpen })
}))