import { useState, useEffect } from "react"
import type { Recipe } from "../types/recipe"

export function useRelatedRecipes(recipeId: number | undefined): Recipe[] {
    const [recipes, setRecipes] = useState<Recipe[]>([])

    useEffect(() => {
        if (!recipeId) return
        fetch(`http://127.0.0.1:5001/recipes/${recipeId}/related`)
            .then(res => res.json())
            .then(data => setRecipes(data))
    }, [recipeId])

    return recipes
}
