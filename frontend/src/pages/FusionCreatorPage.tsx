import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFusionContext } from "../store/fusionStore";
import FusionDetail from "../components/fusion/FusionDetail";
import LoadingAnimation from "../components/fusion/LoadingAnimation";
import RecipePicker from "../components/fusion/RecipePicker";

export default function FusionCreatorPage() {

    // — Router
    const { state } = useLocation()

    // — Data
    const { selectedRecipes, setSelectedRecipes, resetFusionStore, currentFusion, isGenerating, setIsGenerating, setIsPickerActive } = useFusionContext()

    // — State
    const [ready, setReady] = useState(false)

    // — Effects
    useEffect(() => {
        // Guard: wenn bereits generiert wird (Navigation während Loading), sofort ready setzen.
        // Ohne diesen Guard würde der useEffect isGenerating auf false setzen → LoadingAnimation verschwindet.
        if (isGenerating) {
            setReady(true)
            return
        }

        setIsGenerating(false)

        // Fall 1: User kam von einer RecipeCard (state.id vorhanden) und hat noch nichts ausgewählt.
        // → Store resetten, das Rezept fetchen und als vorausgewählt setzen, Picker öffnen.
        if (state && selectedRecipes.length === 0) {
            resetFusionStore()
            setIsPickerActive(true)
            fetch(`http://127.0.0.1:5001/recipes/${state.id}`)
                .then(res => res.json())
                .then(data => {
                    setSelectedRecipes([data])
                    setReady(true)
                })
            return
        }

        // Fall 2: Direkter Aufruf ohne Kontext → Store resetten falls leer, Picker öffnen
        if (selectedRecipes.length === 0) resetFusionStore()
        setIsPickerActive(true)
        setReady(true)
    }, [])

    // — Render (abhängig vom aktuellen Zustand)
    if (!ready) return null
    if (isGenerating) return <LoadingAnimation />
    if (!currentFusion) return <RecipePicker />
    return <FusionDetail />
}
