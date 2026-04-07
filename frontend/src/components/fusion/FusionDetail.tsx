import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { getLang } from "../../utils/lang"
import BackButton from "../shared/BackButton"
import Badge from "../shared/Badge"
import PortionScaler from "../recipe/PortionScaler"
import IngedientsList from "../recipe/IngedientsList"
import StepsList from "../recipe/StepsList"
import { Pot01Icon, Knife02Icon, ServingFoodIcon } from "hugeicons-react"
import { useFusionContext } from "../../store/fusionStore"
import GenerateForm from "./GenerateForm"

export default function FusionDetail() {
    
    // — i18n
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    // — State
    const recipe = useFusionContext().currentFusion!
    const [servings, setServings] = useState<number>(recipe.servings || 4)

    // — Effects
    useEffect(() => {
        window.scrollTo(0, 0)
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
                <img className="w-full h-full object-cover rounded-b-2xl" src={recipe.image_url} alt={t("recipeDetailPage.alt")}/>
            </section>
            <section className="p-5 mb-23">
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
            </section>
            <GenerateForm feedback />
        </>
    )
}