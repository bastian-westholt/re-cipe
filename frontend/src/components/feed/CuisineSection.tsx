import { useRecipesStore } from "../../store/recipesStore"
import type { Recipe } from "../../types/recipe"
import RecipeCard from "./RecipeCard"
import { Link, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { getLang } from "../../utils/lang"

interface CuisineSectionProp {
    type: "original" | "fusion"
}

export default function CuisineSection({ type }: CuisineSectionProp) {

    const [searchParams, setSearchParams] = useSearchParams()

    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    const { recipes } = useRecipesStore()

    const search = searchParams.get("q")
    const matchesSearch = (r: Recipe, search: string) =>
        (getLang(r, "description", currentLang) as string).toLowerCase().includes(search?.toLowerCase()) ||
        (getLang(r, "title", currentLang) as string).toLowerCase().includes(search?.toLowerCase())

    const filtered = search 
        ? recipes.filter(r => r.type === type && matchesSearch(r, search)) 
        : recipes.filter(r => r.type === type)
    const countries = [...new Set(filtered.map(recipe => getLang(recipe, "origin_country", currentLang)))]

    if (type === 'original') {
        return (
            <>
                {countries.map(country => (
                    <section key={country} className="flex flex-col gap-1">
                        <h1 className="mb-4 font-display">{country}</h1>
                        <div className="flex overflow-x-auto gap-3 scrollbar-hide -mx-4 px-4 py-2">
                            {filtered.filter(r => getLang(r, "origin_country", currentLang) === country).map(recipe =>
                                <Link key={recipe.id} state={recipe} to={`/recipes/${recipe.id}`} relative="path">
                                    <RecipeCard recipe={recipe} type={type as 'original' | 'fusion'} />
                                </Link>
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
                    <div className="flex flex-col items-center gap-8 -mx-4 px-4">
                        {filtered.map(recipe =>
                            <Link key={recipe.id} state={recipe} className="w-full" to={`/recipes/${recipe.id}`} relative="path">
                                <RecipeCard recipe={recipe} type={type as 'original' | 'fusion'} />
                            </Link>
                        )}
                    </div>
                </section>
            </>
        )
    }
}