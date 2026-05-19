import { useState, useEffect } from "react"
import type { Recipe } from "../types/recipe"
const API_URL = import.meta.env.VITE_API_URL

export function useRelatedRecipes(recipeId: number | undefined): Recipe[] {
    const [recipes, setRecipes] = useState<Recipe[]>([])

    useEffect(() => {
        if (!recipeId) return
        fetch(`${API_URL}/recipes/${recipeId}/related`)
            .then(res => res.json())
            .then(data => setRecipes(data))
    }, [recipeId])

    return recipes
}
