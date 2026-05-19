import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import type { Recipe } from "../types/recipe"
const API_URL = import.meta.env.VITE_API_URL


export function useThemedRecipes(title: string): Recipe[] {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [searchParams] = useSearchParams()
    const type = searchParams.get("type") ?? "original"

    useEffect(() => {
        fetch(`${API_URL}/recipes/themes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        })
            .then(res => res.json())
            .then(data => setRecipes(data))
    }, [title])

    return recipes.filter(r => r.type === type)
}
