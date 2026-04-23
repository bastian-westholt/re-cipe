import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import type { Recipe } from "../types/recipe"

export function useThemedRecipes(title: string): Recipe[] {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [searchParams] = useSearchParams()
    const type = searchParams.get("type") ?? "original"

    useEffect(() => {
        fetch("http://127.0.0.1:5001/recipes/themes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        })
            .then(res => res.json())
            .then(data => setRecipes(data))
    }, [title])

    return recipes.filter(r => r.type === type)
}
