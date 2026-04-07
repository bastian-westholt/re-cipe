import { getTypeBG } from "../../utils/styles";
import { useTranslation } from "react-i18next";

interface PortionScalerProps {
    type: string
    servings: number
    onChange: (value: number) => void
}

export default function PortionScaler({ type, servings, onChange }: PortionScalerProps) {

    // — i18n
    const { t } = useTranslation()

    return (
        <form className="flex w-full gap-3 h-14 mb-6">
            <label className={`flex items-center w-2/3 ${getTypeBG(type, true)} border-2 border-border rounded-xl py-3 px-5 font-semibold neo-shadow-sm`} htmlFor="servings">{t("recipeDetailPage.portions")}</label>
            <input className="w-1/3 bg-white border-2 border-border rounded-xl py-3 px-5 font-semibold neo-shadow-sm" type="text" inputMode="numeric" name="servings" value={servings} onChange={(e) => {onChange(e.target.value === '' ? 0 : Number(e.target.value))}} />
        </form>
    )
}