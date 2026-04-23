import { getLang } from "../../utils/lang"
import type { Recipe } from "../../types/recipe"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { getTypeBG } from "../../utils/styles"
import FusionButton from "./FusionButton"
import CheckerToggle from "./CheckerToggle"
import { Link, useSearchParams } from "react-router-dom"
import { useFusionContext } from "../../store/fusionStore"

interface RecipeCardProps {
    recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {

    // — Store
    const [searchParams] = useSearchParams()
    const type = searchParams.get("type") ?? "original"

    // — i18n
    const { i18n } = useTranslation()
    const currentLang = i18n.language

    // — Picker
    const { isPickerActive, selectedRecipes, setSelectedRecipes } = useFusionContext()
    // Nur Original-Rezepte können für Fusionen ausgewählt werden
    const isPickable = isPickerActive && recipe.type === "original"
    const isSelected = selectedRecipes.some(r => r.id === recipe.id)

    function toggleRecipe() {
        if (isSelected) setSelectedRecipes(selectedRecipes.filter(r => r.id !== recipe.id))
        else if (selectedRecipes.length < 5) setSelectedRecipes([...selectedRecipes, recipe]) // max. 5 Rezepte
    }

    // — Styles
    const cardClass = clsx(
        "bg-white border-2 border-border relative overflow-hidden shrink-0",
        "neo-shadow-box relative",
        // Im Fusion-Feed nehmen Cards die volle Breite ein (kein horizontales Scrollen)
        type === 'original' ? "w-60 h-72 rounded-2xl" : "w-full h-72 rounded-2xl"
    )

    // Nicht-ausgewählte Karten im Picker-Mode werden ausgegraut
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
                <div className="absolute top-0 m-4 w-9 h-9 fit">
                    <Link to="/fusion" state={recipe}>
                        <FusionButton variant="mini" />
                    </Link>
                </div>
            )}
            {/* Dual-Render: Im Picker-Mode klickbares div zum Auswählen, sonst Link zur Detail-Page */}
            {isPickable
                ? <div className="w-full h-full cursor-pointer" onClick={toggleRecipe}>{inner}</div>
                : <Link state={recipe} to={`/recipes/${recipe.id}`} relative="path">{inner}</Link>
            }
        </div>
    )
}
