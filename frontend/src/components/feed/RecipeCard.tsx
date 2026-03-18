import { getLang } from "../../utils/lang"
import type { Recipe } from "../../types/recipe"
import { useTranslation } from "react-i18next"

interface RecipeCardProps {
    recipe: Recipe
    type: 'original' | 'fusion'
}

export default function RecipeCard({ recipe, type }: RecipeCardProps) {   

    const { i18n } = useTranslation()
    const currentLang = i18n.language

    return (
        <div className={`${type === 'original' ? "w-80" : "w-full"} h-80 bg-surface rounded-3xl relative overflow-hidden shrink-0`}>
            <img className="w-full h-full object-cover" src={recipe.image_url} alt="A delicious meal"/>
            <div className="absolute -bottom-px w-full bg-surface rounded-3xl p-4">
                <h2>{getLang(recipe, 'title', currentLang)}</h2>
            </div>
        </div>
    )
}