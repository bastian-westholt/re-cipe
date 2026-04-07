import type { Recipe } from "../../types/recipe";
import { getTypeBG } from "../../utils/styles";
import { getLang } from "../../utils/lang";
import { useTranslation } from "react-i18next";

interface IngedientsListProps {
    recipe: Recipe
    servings: number
}

export default function IngedientsList({ recipe, servings }: IngedientsListProps) {

    // — i18n
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    return (
        <div className="mb-5">
            <div className="border-2 border-border rounded-2xl overflow-hidden neo-shadow-box">
                <div className={`${getTypeBG(recipe.type, true)} border-b-2 border-border px-5 py-3`}>
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
    )
}