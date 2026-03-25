import { create } from "zustand";

interface SearchStore {
    isSearchOpen: boolean
    setIsSearchOpen: (isSearchOpen: boolean) => void
    isAiSearch: boolean
    setIsAiSearch: (isAiSearch: boolean) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
    isSearchOpen: false,
    setIsSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
    isAiSearch: false,
    setIsAiSearch: (isAiSearch) => set({ isAiSearch })
}))