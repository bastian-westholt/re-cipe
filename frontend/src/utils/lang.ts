import type { Recipe, Ingredients, Step } from "../types/recipe";

/**
 * Liest ein sprachspezifisches Feld aus einem Rezept-, Zutaten- oder Schritt-Objekt.
 * Alle Text-Felder in der DB existieren als Paare: z.B. `title_de` und `title_en`.
 * getLang(recipe, "title", "de") gibt recipe.title_de zurück.
 *
 * Das `as unknown as Record<string, unknown>` ist ein TypeScript-Workaround:
 * TypeScript kennt `title_de` nicht als festen Key — der Zugriff per Template-String
 * `${field}_${lang}` wäre sonst ein Typ-Fehler. Der Cast umgeht das.
 */
export function getLang(obj: Recipe | Ingredients | Step, field: string, lang: string): string | number | null | undefined {
    return (obj as unknown as Record<string, unknown>)[`${field}_${lang}`] as string | number | null | undefined
}
