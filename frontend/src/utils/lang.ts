import type { Recipe, Ingredients, Step } from "../types/recipe";

export function getLang(obj: Recipe | Ingredients | Step, field: string, lang: string): string | number | null | undefined {
    return (obj as Record<string, unknown>)[`${field}_${lang}`] as string | number | null | undefined
}