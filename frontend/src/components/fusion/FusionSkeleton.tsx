import clsx from "clsx"
import { useTranslation } from "react-i18next" 
import { useEffect, useState } from "react"
import { useLocation, useParams, Link } from "react-router-dom"
import { useFusionContext } from "../../store/fusionStore"
import type { Recipe } from "../../types/recipe"
import BackButton from "../../components/shared/BackButton"
import { SkeletonLines } from "../../components/shared/Skeleton"
import { Add01Icon } from "hugeicons-react"
import GenerateForm from "./GenerateForm"

export default function FusionSkeleton() {

    // — i18n
    const { t, i18n } = useTranslation()

    // — Router
    const { state } = useLocation()
    const { id } = useParams()

    // — Store
    const { selectedRecipes, setSelectedRecipes } = useFusionContext()

    // — State
    const [recipe, setRecipe] = useState<Recipe>({} as Recipe)

    // — Effects
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // — Styles
    const heroSectionClass = clsx(
        "w-full h-[60vh]",
        "relative overflow-hidden"
    )

    const shimmerClass = clsx(
        "animate-shimmer inset-0 absolute",
        "bg-linear-to-r from-transparent",
        "via-white/60 to-transparent"
    )

    return (
        <>
            <section className={heroSectionClass}>
                <div className="absolute top-0 m-5 z-10">
                    <BackButton />
                </div>
                <div className="w-full h-20 absolute bottom-5 overflow-x-auto scrollbar-hide z-5">
                    <div className="flex items-center gap-4 h-full px-5 mx-auto w-fit">
                        {selectedRecipes.map(recipe => (
                            <div key={recipe.id} className="w-20 h-full bg-gray-400 rounded-2xl overflow-hidden shrink-0 border-2 border-primary">
                                <img className="w-full h-full object-cover" src={recipe?.image_url} alt="a delicious meal" />
                            </div>
                        ))}
                        <Link className="w-20 h-full bg-gray-400 rounded-2xl flex justify-center items-center shrink-0" to="pick" relative="path">
                            <Add01Icon color="white" size="32px"/>
                        </Link>
                    </div>
                </div>
                <div className="w-full h-full object-cover rounded-b-2xl bg-gray-200/50">
                    <div className={shimmerClass}></div>
                </div>
            </section>
            <section className="p-5">
                <div className="mb-3">
                    <SkeletonLines count={1} height="big" />
                </div>
                <div className="mb-6">
                    <SkeletonLines count={4} />
                </div>
            </section>
            <GenerateForm />
        </>
    )
}