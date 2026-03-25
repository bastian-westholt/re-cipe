import clsx from "clsx"
import { useLocation } from "react-router-dom"
import FusionButton from "../components/shared/FusionButton"
import FavoriteButton from "../components/shared/FavoriteButton"
import Badge from "../components/shared/Badge"
import { Pot01Icon, Knife02Icon, ServingFoodIcon } from 'hugeicons-react'
import { useEffect, useState } from "react"
import type { Recipe } from "../types/recipe"
import { useTranslation } from "react-i18next"
import { getLang } from "../utils/lang"
import BackButton from "../components/shared/BackButton"

export default function RecipeDetailPage() {

    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    const { state } = useLocation()
    const recipeId = state.id

    const [ recipe, setRecipe ] = useState<Recipe>({} as Recipe)
    const [servings, setServings] = useState<number>(0)

    useEffect(() => {
        fetch(`http://127.0.0.1:5001/recipes/${recipeId}`)
            .then(res => res.json())
            .then(data => {
                setRecipe(data)
                setServings(data.servings)
            })
    }, [])

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
                    <FusionButton variant="card" />
                </div>
                <div className="absolute bottom-0 right-0 m-5">
                    <FavoriteButton variant="card" />
                </div>
                <img className="w-full h-full object-cover rounded-b-2xl" src={recipe.image_url} alt={t("recipeDetailPage.alt")}/>
            </section>
            <section className="p-5 mb-23">
                <h1 className="mb-3 font-display">{getLang(recipe, "title", currentLang)}</h1>
                <p className="mb-6 text-black/70">{getLang(recipe, "description", currentLang)}</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 mb-6">
                    <Badge label={getLang(recipe, "origin_country", currentLang)} variant="primary"/>
                    <Badge label={recipe.difficulty} variant={recipe.type === 'fusion' ? 'fusion' : 'default'}/>
                    <Badge icon={<Knife02Icon size={20} />} label={`${recipe.prep_time} ${t("recipeDetailPage.min")}`} variant={recipe.type === 'fusion' ? 'fusion' : 'default'}/>
                    {
                        recipe.cook_time === 0
                            ? null
                            : <Badge icon={<Pot01Icon size={20} />} label={`${recipe.cook_time} ${t("recipeDetailPage.min")}`} variant={recipe.type === 'fusion' ? 'fusion' : 'default'}/>
                    }
                    <Badge icon={<ServingFoodIcon size={20} />} label={`${recipe.prep_time + recipe.cook_time} ${t("recipeDetailPage.min")}`} variant={recipe.type === 'fusion' ? 'fusion' : 'default'}/>
                </div>
                <form className="flex w-full gap-3 h-14 mb-6">
                    <label className={`flex items-center w-2/3 ${recipe.type === 'fusion' ? 'bg-accent-2' : 'bg-accent-1'} border-2 border-border rounded-xl py-3 px-5 font-semibold neo-shadow-sm`} htmlFor="servings">{t("recipeDetailPage.portions")}</label>
                    <input className="w-1/3 bg-white border-2 border-border rounded-xl py-3 px-5 font-semibold neo-shadow-sm" type="text" inputMode="numeric" name="servings" value={servings} onChange={(e) => {setServings(e.target.value === '' ? 0 : Number(e.target.value))}} />
                </form>
                <div className="mb-5">
                    <div className="border-2 border-border rounded-2xl overflow-hidden neo-shadow-box">
                        <div className={`${recipe.type === 'fusion' ? 'bg-accent-2' : 'bg-accent-1'} border-b-2 border-border px-5 py-3`}>
                            <h3 className="text-color-2">{t("recipeDetailPage.ingredients")}</h3>
                        </div>
                        <ul className="flex flex-col">
                            {recipe.ingredients?.map((ing: any, i: number) => (
                                <li key={ing.id} className={`flex items-center justify-between px-5 py-4 border-b border-border/10 ${i % 2 === 0 ? 'bg-white' : 'bg-surface'}`}>
                                    <div className="font-semibold">{getLang(ing, "name", currentLang)}</div>
                                    <div className="whitespace-nowrap ml-6 font-bold text-primary">
                                        {((ing.amount/recipe.servings) * servings) % 1 === 0
                                            ? (ing.amount/recipe.servings) * servings
                                            : ((ing.amount/recipe.servings) * servings).toFixed(1)} {getLang(ing, "unit", currentLang)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <div className="border-2 border-border rounded-2xl overflow-hidden neo-shadow-box">
                        <div className={`${recipe.type === 'fusion' ? 'bg-accent-1' : 'bg-accent-2'} border-b-2 border-border px-5 py-3`}>
                            <h3 className="text-color-2">{t("recipeDetailPage.steps")}</h3>
                        </div>
                        <div className="flex flex-col">
                            {recipe.steps?.map((stp: any, i: number) => (
                                <div key={stp.id} className={`border-b border-border/10 last:border-b-0 py-5 px-5 ${i % 2 === 0 ? 'bg-white' : 'bg-surface'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="font-bold">{t("recipeDetailPage.step")}</div>
                                        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0">{stp.step_number}</div>
                                    </div>
                                    <p className="text-black/80">{getLang(stp, "instruction", currentLang)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
