import { useTranslation } from "react-i18next"
import clsx from "clsx"

export default function LangToggle() {

    const langToggleClass = clsx(
        "flex items-center justify-center",
        "w-11 h-11 bg-color-2 border-2 border-border rounded-xl",
        "neo-shadow-sm",
        "fixed left-5 top-5 z-11 font-extralight"
    )

    const { i18n } = useTranslation()
    const currentLang = i18n.language

    function handleToggle() {
        if (currentLang === 'de') {
            i18n.changeLanguage('en')
        } else {
            i18n.changeLanguage('de')
        }
    }

    return (
        <button className={langToggleClass} onClick={handleToggle}>
            <h3 className="text-color-1">{currentLang === 'de' ? 'DE' : 'EN'}</h3>
        </button>
    )
}
