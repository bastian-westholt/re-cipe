import type { Recipe } from "../types/recipe";
import { getLang } from "./lang";

// Toggle

export function toggleFilter(r: Recipe, key: string): boolean {
    if (key === "easy") return r.difficulty === "easy"
    if (key === "quick") return (r.cook_time + r.prep_time) <= 30
    return true
}

// Selection

export function selectionFilter(recipes: Recipe[], type: string | null, filterKey: string, lang?: string) {
    const filtered = !type ? recipes : recipes.filter(r => r.type === type)
    const options = [...new Set(filtered.map(r => 
            lang
                ? getLang(r, filterKey, lang)
                : r[filterKey as keyof Recipe]
            )
        .filter(Boolean))]
    if (filterKey === "difficulty") {
        const order = ["easy", "medium", "hard"]
        return options.sort((a, b) => order.indexOf(a as string) - order.indexOf(b as string))
    }
    return options.sort()
}