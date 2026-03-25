import clsx from "clsx"
import { BlenderIcon, ServingFoodIcon } from "hugeicons-react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface TypeToggleProps {
    activeType: 'original' | 'fusion'
}

export default function TypeToggle({ activeType }: TypeToggleProps) {

    const { t } = useTranslation()

    const setSearchParams = useSearchParams()[1]

    const type = activeType

    const typeToggleBgClass = clsx(
        "fixed top-4 left-1/2 -translate-x-1/2",
        "rounded-2xl bg-color-1 border-2 border-border",
        "neo-shadow",
        "flex items-center justify-evenly p-1",
        "z-10"
    )

    const typeToggleClass = clsx(
        "w-24 h-9 rounded-xl border-2 border-border",
        type === 'original' ? "bg-accent-1" : "bg-accent-2",
        "text-color-2 text-[12px] font-bold",
        "flex items-center justify-center",
        "px-2",
    )

    function typeToggleHandle() {
        setSearchParams({ type : type === 'original'
                ? 'fusion'
                : 'original'
            })
        }


    return (
        <div className={typeToggleBgClass} onClick={typeToggleHandle}>
            {type === "original" ? (
                <>
                <div className={typeToggleClass}>
                    <h4>{t('typeToggle.original')}</h4>
                </div>
                <BlenderIcon className="mx-3 text-color-2" size={16} />
                </>
            ) : (
                <>
                <ServingFoodIcon className="mx-3 text-color-2" size={16} />
                <div className={typeToggleClass}>
                    <h4>{t('typeToggle.fusion')}</h4>
                </div>
                </>
            )}
        </div>
    )
}
