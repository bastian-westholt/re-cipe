import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Tick02Icon } from "hugeicons-react"
import { useRecipesStore } from "../../store/recipesStore"
import { useFusionContext } from "../../store/fusionStore"
import { getLang } from "../../utils/lang"
import { getTypeBG } from "../../utils/styles"
import { toggleFilter } from "../../utils/filter"
import type { Recipe } from "../../types/recipe"
import clsx from "clsx"
import { useFilterStore } from "../../store/filterStore"
import CheckerToggle from "../shared/CheckerToggle"
import BottomNav from "../BottomNav"
import BackButton from "../shared/BackButton"

export default function RecipePicker() {

    // — i18n
    const { i18n } = useTranslation()
    const currentLang = i18n.language

    // — Router
    const [searchParams] = useSearchParams()
    const search = searchParams.get("q")

    // — Store
    const { recipes } = useRecipesStore()
    const { selectedRecipes, setSelectedRecipes } = useFusionContext()
    const { activeFilters } = useFilterStore()

    // — Derived
    const matchesSearch = (r: Recipe) =>
        !search || (
            (getLang(r, "title", currentLang) as string).toLowerCase().includes(search.toLowerCase()) ||
            (getLang(r, "description", currentLang) as string).toLowerCase().includes(search.toLowerCase()) ||
            (getLang(r, "origin_country", currentLang) as string).toLowerCase().includes(search.toLowerCase())
        )

    const matchesFilter = (r: Recipe) =>
        Object.entries(activeFilters).every(([key, values]) => {
            if (values.includes("true")) return toggleFilter(r, key)
            const recipeValue = getLang(r, key, currentLang) as string ?? r[key as keyof Recipe]
            return values.includes(recipeValue)
        })

    const originals = recipes
        .filter(r => r.type === "original")
        .filter(r => matchesSearch(r))
        .filter(r => matchesFilter(r))

    const countries = [...new Set(originals.map(r => getLang(r, "origin_country", currentLang)))]

    function toggleRecipe(recipe: Recipe) {
        const isSelected = selectedRecipes.some(r => r.id === recipe.id)
        if (isSelected) {
            setSelectedRecipes(selectedRecipes.filter(r => r.id !== recipe.id))
        } else if (selectedRecipes.length < 5) {
            setSelectedRecipes([...selectedRecipes, recipe])
        }
    }

    return (
        <>
            {/* — Selection Bar */}
            <div className="joyride-recipe-slots fixed min-h-19 top-4 left-1/2 -translate-x-1/2 w-[90dvw] bg-color-2 border-2 border-border rounded-2xl neo-shadow px-4 py-3 flex items-center gap-3 z-11">
                <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide">
                    <BackButton variant="icon"/>
                    {selectedRecipes.length === 0 && (
                        <p className="text-muted text-sm">Wähle 2–5 Rezepte</p>
                    )}
                    {selectedRecipes.map(r => (
                        <div
                            key={r.id}
                            onClick={() => setSelectedRecipes(selectedRecipes.filter(s => s.id !== r.id))}
                            className="w-12 h-12 rounded-xl border-2 border-border overflow-hidden shrink-0"
                        >
                            <img className="w-full h-full object-cover" src={r.image_url} alt="" />
                        </div>
                    ))}
                </div>
            </div>

            {/* — Recipe List */}
            <div className="flex flex-col gap-10 pt-32 pb-30 px-4">
                {countries.map(country => (
                    <section key={country} className="flex flex-col gap-1">
                        <h1 className="mb-4 font-display">{country}</h1>
                        <div className="flex overflow-x-auto gap-3 scrollbar-hide -mx-4 px-5 py-2">
                            {originals
                                .filter(r => getLang(r, "origin_country", currentLang) === country)
                                .map(recipe => {
                                    const isSelected = selectedRecipes.some(r => r.id === recipe.id)
                                    const cardClass = clsx(
                                        "bg-white border-2 border-primary relative overflow-hidden shrink-0 w-60 h-72 rounded-2xl neo-shadow-box",
                                    )
                                    const imageClass = clsx("w-full h-full object-cover" , isSelected ? "opacity-100" : "opacity-50")
                                    return (
                                        <div key={recipe.id} className={cardClass} onClick={() => toggleRecipe(recipe)}>
                                            <CheckerToggle isSelected={isSelected}/>
                                            <img className={imageClass} src={recipe.image_url} alt="A delicious meal" />
                                            <div className={`absolute bottom-0 w-full border-t-2 border-border rounded-t-2xl p-3 ${getTypeBG("original")}`}>
                                                <h3 className="font-bold truncate text-color-2">{getLang(recipe, "title", currentLang)}</h3>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </section>
                ))}
            </div>
            <BottomNav />
        </>
    )
}
