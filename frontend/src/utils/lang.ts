import type { Recipe } from "../types/recipe";

export function getLang(obj: Recipe, field: string, lang: string): string | number | null | undefined {
    return obj[`${field}_${lang}` as keyof Recipe]
}