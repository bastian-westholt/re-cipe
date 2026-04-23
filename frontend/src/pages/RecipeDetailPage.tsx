import clsx from "clsx"
import { useParams, Link, useSearchParams } from "react-router-dom"
import FusionButton from "../components/shared/FusionButton"
import FavoriteButton from "../components/shared/FavoriteButton"
import Badge from "../components/shared/Badge"
import IngedientsList from "../components/recipe/IngedientsList"
import StepsList from "../components/recipe/StepsList"
import PortionScaler from "../components/recipe/PortionScaler"
import { Pot01Icon, Knife02Icon, ServingFoodIcon } from 'hugeicons-react'
import { useEffect, useState } from "react"
import type { Recipe } from "../types/recipe"
import { useTranslation } from "react-i18next"
import { getLang } from "../utils/lang"
import BackButton from "../components/shared/BackButton"
import { RecipeSection } from "../components/shared/sections"
import RecipeCard from "../components/shared/sections/RecipeCard"
import { useRelatedRecipes } from "../hooks/useRelatedRecipes"

export default function RecipeDetailPage() {

    // — i18n
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    // — Router
    const { id } = useParams()

    // — State
    const [recipe, setRecipe] = useState<Recipe>({} as Recipe)
    const [servings, setServings] = useState<number>(4)
    const relatedRecipes = useRelatedRecipes(recipe?.id)

    // — Effects
    useEffect(() => { window.scrollTo(0, 0) }, [])

    useEffect(() => {
        fetch(`http://127.0.0.1:5001/recipes/${id}`)
            .then(res => res.json())
            .then(data => {
                setRecipe(data)
                setServings(data.servings)
            })
    }, [])


    // — Styles
    const heroSectionClass = clsx(
        "w-full h-[60vh]",
        "relative"
    )

    return (
        <>
            <section className={heroSectionClass}>
                <div className="absolute top-0 m-5">
                    <BackButton />
                </div>
                <div className="absolute bottom-0 m-5">
                    <Link to={`/fusion`} state={recipe}>
                        <FusionButton variant="card" />
                    </Link>
                </div>
                <div className="absolute bottom-0 right-0 m-5">
                    <FavoriteButton variant="card" />
                </div>
                <img className="w-full h-full object-cover rounded-b-2xl" src={recipe.image_url} alt={t("recipeDetailPage.alt")}/>
            </section>
            <section className="p-5 mb-2">
                <h1 className="mb-3 font-display">{getLang(recipe, "title", currentLang)}</h1>
                <p className="mb-6 text-black/70">{getLang(recipe, "description", currentLang)}</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 mb-4 pb-2">
                    {getLang(recipe, "origin_country", currentLang) && <Badge label={getLang(recipe, "origin_country", currentLang) as string} variant="primary"/>}
                    <Badge label={recipe.difficulty} variant={recipe.type === 'fusion' ? 'fusion' : 'default'}/>
                    <Badge icon={<Knife02Icon size={20} />} label={`${recipe.prep_time} ${t("recipeDetailPage.min")}`} variant={recipe.type === 'fusion' ? 'fusion' : 'default'}/>
                    {
                        recipe.cook_time === 0
                            ? null
                            : <Badge icon={<Pot01Icon size={20} />} label={`${recipe.cook_time} ${t("recipeDetailPage.min")}`} variant={recipe.type === 'fusion' ? 'fusion' : 'default'}/>
                    }
                    <Badge icon={<ServingFoodIcon size={20} />} label={`${recipe.prep_time + recipe.cook_time} ${t("recipeDetailPage.min")}`} variant={recipe.type === 'fusion' ? 'fusion' : 'default'}/>
                </div>
                <PortionScaler type={recipe.type} servings={servings} onChange={setServings} />
                <IngedientsList recipe={recipe} servings={servings} />
                <StepsList recipe={recipe} />
                <div className="mt-6">
                {recipe.type === 'fusion' && relatedRecipes.length > 0 && (
                    <RecipeSection title="Related recipes">
                        <RecipeSection.ScrollRow>
                            {relatedRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
                        </RecipeSection.ScrollRow>
                    </RecipeSection>
                )}
                </div>
            </section>
        </>
    )
}
