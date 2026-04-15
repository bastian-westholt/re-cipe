import { useRecipesStore } from "../../store/recipesStore"
import type { Recipe } from "../../types/recipe"
import RecipeCard from "./RecipeCard"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { getLang } from "../../utils/lang"
import { useFilterStore } from "../../store/filterStore"
import { toggleFilter } from "../../utils/filter"
import FusionButton from "../shared/FusionButton"

export default function CuisineSection() {

    // — Data
    const { recipes } = useRecipesStore()
    const { activeFilters } = useFilterStore()
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language
    const [searchParams] = useSearchParams()
    const type = searchParams.get("type") ?? "original"
    const search = searchParams.get("q")

    // — Derived
    const matchesSearch = (r: Recipe, search: string) =>
        (getLang(r, "description", currentLang) as string).toLowerCase().includes(search?.toLowerCase()) ||
        (getLang(r, "title", currentLang) as string).toLowerCase().includes(search?.toLowerCase()) ||
        (getLang(r, "origin_country", currentLang) as string).toLowerCase().includes(search?.toLowerCase())

    const matchesFilter = (r: Recipe, filters: Record<string, string[]>) => {
        return Object.entries(filters).every(([key, values]) => {
            if (values.includes("true")) {
                return toggleFilter(r, key)
            } else {
                const recipeValue = getLang(r, key, currentLang) as string ?? r[key as keyof Recipe]
                return values.includes(recipeValue)
            }
        })
    }

    const filtered = recipes
        .filter(r => r.type === type)
        .filter(r => !search || matchesSearch(r, search))
        .filter(r => matchesFilter(r, activeFilters))

    const countries = [...new Set(filtered.map(recipe => getLang(recipe, "origin_country", currentLang)))]

    if (type === 'original') {
        return (
            <>
                {countries.map(country => (
                    <section key={country} className="flex flex-col gap-1">
                        <h1 className="mb-4 font-display">{country}</h1>
                        <div className="flex overflow-x-auto gap-3 scrollbar-hide -mx-4 px-5 py-2">
                            {filtered.filter(r => getLang(r, "origin_country", currentLang) === country).map(recipe =>
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            )}
                        </div>
                    </section>
                ))}
            </>
        )
    } else {
        return (
            <>
                <section className="flex flex-col gap-1">
                    <h1 className="mb-4 font-display">{t("feedPage.allFusions")}</h1>
                    <div className="flex flex-col items-center gap-8 -mx-4 px-5">
                        {filtered.map(recipe =>
                            <RecipeCard key={recipe.id} recipe={recipe} type={type as 'original' | 'fusion'} />
                        )}
                    </div>
                </section>
            </>
        )
    }
}