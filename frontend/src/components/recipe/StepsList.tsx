import type { Recipe } from "../../types/recipe";
import { getTypeBG } from "../../utils/styles";
import { getLang } from "../../utils/lang";
import { useTranslation } from "react-i18next";

interface StepsListProps {
    recipe: Recipe
}

export default function StepsList({ recipe }: StepsListProps) {

    // — i18n
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    return (
        <div>
            <div className="border-2 border-border rounded-2xl overflow-hidden neo-shadow-box">
                <div className={`${getTypeBG(recipe.type)} border-b-2 border-border px-5 py-3`}>
                    <h3 className="text-color-2">{t("recipeDetailPage.steps")}</h3>
                </div>
                <div className="flex flex-col">
                    {recipe.steps?.map((stp: any, i: number) => (
                        <div key={stp.id} className={`border-b border-border/10 last:border-b-0 py-5 px-5 ${i % 2 === 0 ? 'bg-white' : 'bg-surface'}`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="font-bold">{t("recipeDetailPage.step")}</div>
                                <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0">{stp.step_number}</div>
                            </div>
                            <p className="text-black/80">{getLang(stp, "instruction", currentLang)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}