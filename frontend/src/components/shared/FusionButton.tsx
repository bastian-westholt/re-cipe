import clsx from 'clsx'
import { BlenderIcon, Tick02Icon } from 'hugeicons-react'
import { getTypeBG, getTypePara } from '../../utils/styles';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useFusionContext } from '../../store/fusionStore';

interface FusionButtonProps {
    variant: "fab" | "card" | "mini";
    onClick?: () => void;
}

export default function FusionButton({ variant, onClick = () => {} }: FusionButtonProps) {

    // — Router
    const [ searchParams ] = useSearchParams()
    const type = searchParams.get('type')
    const { pathname } = useLocation()
    const isFusion = pathname == '/fusion'

    // — Store
    const { isPickerActive } = useFusionContext()

    // isActive kombiniert zwei Fälle:
    // 1. User ist auf /fusion → Button zeigt Bestätigung (Tick)
    // 2. Picker ist aktiv (auf beliebiger Route) → FAB zeigt ebenfalls Tick als visuelles Feedback
    const isActive = isFusion || (variant === "fab" && isPickerActive)

    // — Styles
    const Icon = isActive ? Tick02Icon : BlenderIcon
    const buttonClass = clsx(
        "border-2 flex items-center justify-center",
        variant === "fab" && `joyride-fusion-btn w-16 h-16 rounded-2xl my-2 mr-1 ${(isActive ? "joyride-generate bg-accent-2 border-border neo-shadow" : "bg-primary border-border-on-primary neo-shadow-dark")}`,
        variant === "card" && `${getTypeBG(type)} border-primary neo-shadow-sm w-12 h-12 rounded-xl`,
        variant === "mini" && `${getTypeBG(type)} border-primary neo-shadow-sm w-8 h-8 rounded-lg`,
    )

    const iconColor = variant === "fab" ? "text-white" : getTypePara(type, true)

    return (
        <button className={buttonClass} onClick={onClick}>
            <Icon size={variant === "fab" ? 32 : variant === "card" ? 22 : 16} className={iconColor} />
        </button>
    )
}
