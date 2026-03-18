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
        "rounded-full bg-surface",
        "flex items-center justify-evenly p-1 m-1",
        "z-10"
    )

    const typeToggleClass = clsx(
        "w-24 h-9 rounded-full bg-primary",
        "text-color-1 text-[12px]",
        "flex items-center justify-center",
        "px-2",
        "transition-all duration-300"
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
                <BlenderIcon className="mx-3 -translate-x-px" size={16} />
                </>
            ) : (
                <>
                <ServingFoodIcon className="mx-3 translate-x-px" size={16} />
                <div className={typeToggleClass}>
                    <h4>{t('typeToggle.fusion')}</h4>
                </div>
                </>
            )}
        </div>
    )
}