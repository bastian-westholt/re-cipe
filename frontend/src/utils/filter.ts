import type { Recipe } from "../types/recipe";
import { getLang } from "./lang";

// — Toggle-Filter

/**
 * Prüft ob ein einzelnes Rezept einen boolean Toggle-Filter erfüllt.
 * "easy" und "quick" sind die einzigen Toggle-Keys — alle anderen geben true zurück.
 * 30 Minuten ist die Grenze für "Quick": prep_time + cook_time <= 30.
 */
export function toggleFilter(r: Recipe, key: string): boolean {
    if (key === "easy") return r.difficulty === "easy"
    if (key === "quick") return (r.cook_time + r.prep_time) <= 30 // 30min = Quick-Grenze
    return true
}

// — Selection-Filter

/**
 * Gibt alle eindeutigen Werte eines Felds über alle Rezepte zurück — als Options-Liste für die Filter-UI.
 * Beispiel: selectionFilter(recipes, "original", "origin_country", "de") → ["Deutschland", "Italien", ...]
 *
 * `new Set(...)` entfernt Duplikate (jedes Land nur einmal in der Liste).
 * `.filter(Boolean)` entfernt null/undefined-Werte (Felder die nicht gesetzt sind).
 * `lang` wird übergeben wenn das Feld bilingual ist (z.B. origin_country_de vs. origin_country_en).
 * Difficulty wird manuell sortiert (easy → medium → hard), alle anderen alphabetisch.
 */
export function selectionFilter(recipes: Recipe[], type: string | null, filterKey: string, lang?: string) {
    const filtered = !type ? recipes : recipes.filter(r => r.type === type)
    const options = [...new Set(filtered.map(r =>
            lang
                ? getLang(r, filterKey, lang)
                : r[filterKey as keyof Recipe]
            )
        .filter(Boolean))]
    if (filterKey === "difficulty") {
        const order = ["easy", "medium", "hard"] // feste Reihenfolge statt alphabetisch
        return options.sort((a, b) => order.indexOf(a as string) - order.indexOf(b as string))
    }
    return options.sort()
}
