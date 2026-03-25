import { getLang } from "../../utils/lang"
import type { Recipe } from "../../types/recipe"
import { useTranslation } from "react-i18next"
import clsx from "clsx"

interface RecipeCardProps {
    recipe: Recipe
    type: 'original' | 'fusion'
}

export default function RecipeCard({ recipe, type }: RecipeCardProps) {

    const { i18n } = useTranslation()
    const currentLang = i18n.language

    const cardClass = clsx(
        "bg-white border-2 border-border relative overflow-hidden shrink-0",
        "neo-shadow-box",
        type === 'original' ? "w-60 h-72 rounded-2xl" : "w-full h-72 rounded-2xl"
    )

    return (
        <div className={cardClass}>
            <img className="w-full h-full object-cover" src={recipe.image_url} alt="A delicious meal"/>
            <div className={`absolute bottom-0 w-full border-t-2 border-border rounded-t-2xl p-3 ${type === 'original' ? 'bg-accent-2' : 'bg-accent-1'}`}>
                <h3 className="font-bold truncate text-color-2">{getLang(recipe, 'title', currentLang)}</h3>
            </div>
        </div>
    )
}