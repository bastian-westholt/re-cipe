import { create } from "zustand";

interface FilterStore {
    isFilterOpen: boolean
    setIsFilterOpen: (isFilterOpen: boolean) => void
    activeFilters: Record<string, string[]>
    setFilter: (key: string, value: string, multiple?: boolean) => void
    clearFilter: (key: string, value?: string, multiple?: boolean) => void
    resetFilterStore: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
    isFilterOpen: false,
    setIsFilterOpen: (isFilterOpen) => set({ isFilterOpen }),
    activeFilters: {},

    // multiple=true → Wert wird zur bestehenden Liste hinzugefügt (z.B. mehrere Länder)
    // multiple=false → ersetzt den vorherigen Wert (z.B. Schwierigkeitsgrad: nur einer aktiv)
    setFilter: (key, value, multiple) => set((prev) => ({
        activeFilters: multiple
            ? { ...prev.activeFilters, [key]: prev.activeFilters[key] ? [...prev.activeFilters[key], value] : [value] }
            : { ...prev.activeFilters, [key]: [value] }
    })),

    clearFilter: (key, value, multiple) => set((prev) => {
        if (multiple) {
            const choice = prev.activeFilters[key].filter(v => v !== value)
            // Wenn nach dem Entfernen keine Werte mehr übrig sind → Key komplett löschen
            if (choice.length < 1) {
                // Destructuring-Trick: { [key]: _ } extrahiert den Key den wir loswerden wollen,
                // `...rest` enthält alles andere — so entfernen wir einen Key aus einem Objekt ohne delete
                const { [key]: _, ...rest } = prev.activeFilters
                return { activeFilters: rest }
            }
            return { activeFilters: { ...prev.activeFilters, [key]: choice } }
        }
        // Single-Filter: Key direkt entfernen
        const { [key]: _, ...rest } = prev.activeFilters
        return { activeFilters: rest }
    }),

    resetFilterStore: () => set({activeFilters: {}})
}))
