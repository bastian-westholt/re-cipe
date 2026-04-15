import { create } from "zustand";
import type { Recipe } from "../types/recipe";
import type { NavigateFunction } from "react-router-dom";

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
    generateFusion: (feedback?: string) => void
    saveFusion: (navigate: NavigateFunction) => void
    resetStore: () => void
}

export const useFusionContext = create<FusionStore>((set, get) => ({
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
    generateFusion: (feedback) => {
        const { selectedRecipes, currentFusion, messages } = get()
        set({isGenerating: true})
        const nextMessages = feedback ? [
            ...messages,
            { role: "assistant", content: JSON.stringify(currentFusion) },
            { role: "user", content: feedback },
        ] : []
        fetch('http://127.0.0.1:5001/recipes/fusion/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipe_ids: selectedRecipes.map(r => r.id),
                ...(feedback ? { previous_fusion: currentFusion, feedback: feedback } : {})
            })
        })
            .then(res => res.json())
            .then(data => {
              set({
                  currentFusion: data,
                  imageUrl: feedback ? get().imageUrl : (data.image_url ?? get().imageUrl),
                  isGenerating: false,
                  messages: feedback ? nextMessages : [],
              })
            })
    },
    saveFusion: (navigate) => {
        const { selectedRecipes, currentFusion, imageUrl } = get()
        fetch('http://127.0.0.1:5001/recipes/fusion/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...currentFusion,
                recipe_ids: selectedRecipes.map(r => r.id),
                image_url: imageUrl,
            })
        })
            .then(res => res.json())
            .then(data => navigate(`/recipes/${data.id}`, { state: "fusion" }))
    },
    resetStore: () => set({ selectedRecipes: [], currentFusion: null, imageUrl: null, messages: [], isGenerating: false })
}))