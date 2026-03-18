import clsx from "clsx"
import { useLocation } from "react-router-dom"
import FusionButton from "../components/shared/FusionButton"
import FavoriteButton from "../components/shared/FavoriteButton"
import Badge from "../components/shared/Badge"
import { Pot01Icon, Knife02Icon, ServingFoodIcon } from 'hugeicons-react'
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { getLang } from "../utils/lang"
import BackButton from "../components/shared/BackButton"

export default function RecipeDetailPage() {

    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    const { state } = useLocation()
    const recipeId = state.id

    const [ recipe, setRecipe ] = useState<any>({})
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
        "w-full h-[60vh] bg-surface rounded-b-3xl",
        "relative overflow-hidden"
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
                <img className="w-full h-full object-cover" src={recipe.image_url} alt={t("recipeDetailPage.alt")}/>
            </section>
            <section className="p-5 mb-23">
                <h1 className="mb-5">{getLang(recipe, "title", currentLang)}</h1>
                <p className="mb-6">{getLang(recipe, "description", currentLang)}</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 mb-5">
                    <Badge label={getLang(recipe, "origin_country", currentLang)} variant="primary"/>
                    <Badge label={recipe.difficulty} variant="default"/>
                    <Badge icon={<Knife02Icon size={20} />} label={`${recipe.prep_time} ${t("recipeDetailPage.min")}`} variant="default"/>
                    {
                        recipe.cook_time === 0
                            ? null
                            : <Badge icon={<Pot01Icon size={20} />} label={`${recipe.cook_time} ${t("recipeDetailPage.min")}`} variant="default"/>
                    }
                    <Badge icon={<ServingFoodIcon size={20} />} label={`${recipe.prep_time + recipe.cook_time} ${t("recipeDetailPage.min")}`} variant="default"/>
                </div>
                <form className="flex w-full gap-3 h-16 mb-5">
                    <label className="flex items-center w-2/3 bg-surface rounded-full py-3 px-7 font-medium" htmlFor="servings">{t("recipeDetailPage.portions")}</label>
                    <input className="w-1/3 bg-surface/50 rounded-full py-3 px-7" type="text" inputMode="numeric" name="servings" value={servings} onChange={(e) => {setServings(e.target.value === '' ? 0 : Number(e.target.value))}} />
                </form>
                <div className="mb-5">
                    <ul className="flex flex-col gap-3 bg-surface p-3 rounded-3xl">
                        <h3 className="font-medium my-2 mx-5">{t("recipeDetailPage.ingredients")}</h3>
                        {recipe.ingredients?.map((ing: any) => (
                            <li key={ing.id} className="flex items-center justify-between bg-color-1 rounded-3xl px-5 py-5 m">
                                <div className="font-semibold">{getLang(ing, "name", currentLang)}</div>
                                <div className="whitespace-nowrap ml-6 text-primary">
                                    {((ing.amount/recipe.servings) * servings) % 1 === 0 
                                        ? (ing.amount/recipe.servings) * servings 
                                        : ((ing.amount/recipe.servings) * servings).toFixed(1)} {getLang(ing, "unit", currentLang)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className="flex flex-col gap-3 bg-surface p-3 rounded-3xl">
                        <h3 className="font-medium my-2 mx-5">{t("recipeDetailPage.steps")}</h3>
                        {recipe.steps?.map((stp: any) => (
                            <div key={stp.id} className="bg-color-1 rounded-3xl py-5 px-6 m-0">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="font-semibold">{t("recipeDetailPage.step")}</div>
                                    <div className="px-3 py-1.25 ml-6 bg-primary text-color-1 rounded-full">{stp.step_number}</div>
                                </div>
                                <p>{getLang(stp, "instruction", currentLang)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}