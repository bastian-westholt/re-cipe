import type { Recipe } from "../types/recipe"
import { create } from "zustand"

interface RecipesStore {
    recipes: Recipe[]
    setRecipes: (recipes: Recipe[]) => void
}

export const useRecipesStore = create<RecipesStore>((set) => ({
    recipes: [],
    setRecipes: (recipes) => set({ recipes })
}))
