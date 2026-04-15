import { getLang } from "../../utils/lang"
import type { Recipe } from "../../types/recipe"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { getTypeBG } from "../../utils/styles"
import FusionButton from "../shared/FusionButton"
import { Link, useSearchParams } from "react-router-dom"

interface RecipeCardProps {
    recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {

    // — Router
    const [searchParams] = useSearchParams()
    const type = searchParams.get("type") ?? "original"

    const { i18n } = useTranslation()
    const currentLang = i18n.language

    const cardClass = clsx(
        "bg-white border-2 border-border relative overflow-hidden shrink-0",
        "neo-shadow-box relative",
        type === 'original' ? "w-60 h-72 rounded-2xl" : "w-full h-72 rounded-2xl"
    )

    return (
        <div className={cardClass}>
            {type === "original" && (
            <div className="absolute top-0 m-4 w-9 h-9 fit">
                <Link to={`fusion`} state={recipe}>
                    <FusionButton variant="mini"/>
                </Link>
            </div>
            )}
            <Link state={recipe} to={`/recipes/${recipe.id}`} relative="path">
                <img className="w-full h-full object-cover" src={recipe.image_url} alt="A delicious meal"/>
                <div className={`absolute bottom-0 w-full border-t-2 border-border rounded-t-2xl p-3 ${getTypeBG(type)}`}>
                    <h3 className="font-bold truncate text-color-2">{getLang(recipe, 'title', currentLang)}</h3>
                </div>
            </Link>
        </div>
    )
}