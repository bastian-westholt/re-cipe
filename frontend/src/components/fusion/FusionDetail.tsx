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
import { Heatmap } from '@paper-design/shaders-react';

export default function FusionDetail() {
    
    // — i18n
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    // — State
    const { imageUrl } = useFusionContext()
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
                {
                !imageUrl
                    ? <div className="absolute inset-0 overflow-hidden rounded-b-2xl flex justify-center items-center z-10">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                        <Heatmap
                            image="/placeholder.svg"
                            colors={["#0167FE", "#FD72DB", "#C7EF8E", "#0167FE", "#FD72DB"]}
                            colorBack="#fffdf587"
                            contour={0.7}
                            angle={0}
                            noise={0.1}
                            innerGlow={0.3}
                            outerGlow={0.3}
                            speed={1}
                            scale={1.25}
                            fit="cover"
                            style={{ width: '100%', height: '100%' }}
                        />
                        <h1 className="absolute text-white text-4xl font-display -translate-x-6 mix-blend-difference">PLACEHOLDER</h1>
                        <h1 className="absolute text-accent-1 text-4xl font-display -translate-x-6 mix-blend-hue">PLACEHOLDER</h1>
                    </div>
                    : <img className="w-full h-full object-cover rounded-b-2xl" src={recipe.image_url || imageUrl || ''} alt={t("recipeDetailPage.alt")}/>
                }
                <div className="absolute top-0 m-5 z-10">
                    <BackButton />
                </div>
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