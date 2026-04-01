import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFusionContext } from "../store/fusionStore";
import FusionSkeleton from "../components/fusion/FusionSkeleton";
import FusionDetail from "../components/fusion/FusionDetail";
import LoadingAnimation from "../components/fusion/LoadingAnimation";

export default function FusionCreatorPage() {

    // — Router
    const { state } = useLocation()

    // — Data
    const { selectedRecipes, setSelectedRecipes, resetStore, currentFusion, isGenerating, setIsGenerating } = useFusionContext()
    // — State
    const [ready, setReady] = useState(false)

    // — Effects
    useEffect(() => {
        setIsGenerating(false)
        if (state && selectedRecipes.length === 0) {
            resetStore()
            fetch(`http://127.0.0.1:5001/recipes/${state.id}`)
                .then(res => res.json())
                .then(data => {
                    setSelectedRecipes([data])
                    setReady(true)
                })
            return
        }
        if (selectedRecipes.length === 0) resetStore()
        setReady(true)
    }, [])

    if (!ready) return null
    if (isGenerating) return <LoadingAnimation />
    if (!currentFusion) return <FusionSkeleton />
    return <FusionDetail />
}
