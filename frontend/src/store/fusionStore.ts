import { create } from "zustand";
import type { Recipe } from "../types/recipe";

interface FusionStore {
    selectedRecipes: Recipe[]
    setSelectedRecipes: (recipe: Recipe[]) => void
    currentFusion: Recipe | null
    setCurrentFusion: (fusion: Recipe) => void
    imageUrl: string | null
    setImageUrl: (imageUrl: string | null) => void
    messages: object[]
    setMessages: (messages: object[]) => void
    isGenerating: boolean
    setIsGenerating: (isGenerating: boolean) => void
    resetStore: () => void
}

export const useFusionContext = create<FusionStore>((set) => ({
    selectedRecipes: [],
    setSelectedRecipes: (selectedRecipes) => set({ selectedRecipes }),
    currentFusion: null,
    setCurrentFusion: (currentFusion) => set({ currentFusion }),
    imageUrl: null,
    setImageUrl: (imageUrl) => set({ imageUrl }),
    messages: [],
    setMessages: (messages) => set({ messages }),
    isGenerating: false,
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    resetStore: () => set({ selectedRecipes: [], currentFusion: null, imageUrl: null, messages: [], isGenerating: false })
}))