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
    isPickerActive: boolean
    setIsPickerActive: (v: boolean) => void
    generateFusion: (feedback?: string) => void
    saveFusion: (navigate: NavigateFunction) => void
    resetFusionStore: () => void
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
    isPickerActive: false,
    setIsPickerActive: (isPickerActive) => set({ isPickerActive }),

    // — Generate Fusion
    generateFusion: (feedback) => {
        // Guard: verhindert mehrfache parallele Requests wenn User mehrfach klickt
        if (get().isGenerating) return
        const { selectedRecipes, currentFusion, messages } = get()
        set({ isGenerating: true })

        // Beim ersten Aufruf (kein Feedback) → leere Message-History, frischer Start.
        // Bei Feedback → bisherige History + letzte Fusion (als Assistenten-Antwort) + User-Feedback anhängen.
        // Das Backend bekommt so den gesamten Gesprächsverlauf und kann gezielt überarbeiten.
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
                // previous_fusion + feedback nur bei Überarbeitungsrunden mitschicken
                ...(feedback ? { previous_fusion: currentFusion, feedback: feedback } : {})
            })
        })
            .then(res => res.json())
            .then(data => {
              set({
                  currentFusion: data,
                  // imageUrl nur beim ersten Generate aus der Response übernehmen.
                  // Bei Feedback-Runden bleibt das bestehende Bild erhalten — das Backend generiert kein neues.
                  imageUrl: feedback ? get().imageUrl : (data.image_url ?? get().imageUrl),
                  isGenerating: false,
                  messages: feedback ? nextMessages : [],
              })
            })
    },

    // — Save Fusion
    saveFusion: (navigate) => {
        // Guard: verhindert mehrfaches Speichern wenn User den Button mehrfach klickt
        if (get().isGenerating) return
        set({ isGenerating: true })
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
            // Nach erfolgreichem Save zur Detail-Page navigieren, state="fusion" markiert den Ursprung
            .then(data => navigate(`/recipes/${data.id}`, { state: "fusion" }))
    },

    resetFusionStore: () => set({ selectedRecipes: [], currentFusion: null, imageUrl: null, messages: [], isGenerating: false, isPickerActive: false })
}))
