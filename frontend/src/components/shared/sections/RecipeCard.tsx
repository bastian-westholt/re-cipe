import { getLang } from "../../../utils/lang"
import type { Recipe } from "../../../types/recipe"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { getTypeBG } from "../../../utils/styles"
import FusionButton from "../FusionButton"
import CheckerToggle from "../CheckerToggle"
import { Link, useSearchParams } from "react-router-dom"
import { useFusionContext } from "../../../store/fusionStore"

interface RecipeCardProps {
    recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {

    const [searchParams] = useSearchParams()
    const type = searchParams.get("type") ?? "original"

    const { i18n } = useTranslation()
    const currentLang = i18n.language

    const { isPickerActive, setIsPickerActive, selectedRecipes, setSelectedRecipes } = useFusionContext()
    const isPickable = isPickerActive && recipe.type === "original"
    const isSelected = selectedRecipes.some(r => r.id === recipe.id)

    function toggleRecipe() {
        if (isSelected) setSelectedRecipes(selectedRecipes.filter(r => r.id !== recipe.id))
        else if (selectedRecipes.length < 5) setSelectedRecipes([...selectedRecipes, recipe])
    }

    const cardClass = clsx(
        "bg-white border-2 border-border relative overflow-hidden shrink-0",
        "neo-shadow-box relative",
        type === 'original' ? "w-60 h-72 rounded-2xl" : "w-full h-72 rounded-2xl"
    )

    const imageClass = clsx("w-full h-full object-cover", isPickable && !isSelected && "opacity-50")

    const inner = (
        <>
            <img className={imageClass} src={recipe.image_url} alt="A delicious meal" />
            <div className={`absolute bottom-0 w-full border-t-2 border-border rounded-t-2xl p-3 ${getTypeBG(type)}`}>
                <h3 className="font-bold truncate text-color-2">{getLang(recipe, 'title', currentLang)}</h3>
            </div>
        </>
    )

    return (
        <div className={cardClass}>
            {isPickable && <CheckerToggle isSelected={isSelected} />}
            {!isPickerActive && type === "original" && (
                <div className="absolute top-0 m-4 w-9 h-9 fit" onClick={(e) => { e.preventDefault(); setIsPickerActive(true); setSelectedRecipes([recipe]) }}>
                    <FusionButton variant="mini" />
                </div>
            )}
            {isPickable
                ? <div className="w-full h-full cursor-pointer" onClick={toggleRecipe}>{inner}</div>
                : <Link state={recipe} to={`/recipes/${recipe.id}`} relative="path">{inner}</Link>
            }
        </div>
    )
}