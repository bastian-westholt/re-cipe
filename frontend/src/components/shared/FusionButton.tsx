import clsx from 'clsx'
import { BlenderIcon, Tick02Icon } from 'hugeicons-react'
import { getTypeBG, getTypeColor, getTypePara } from '../../utils/styles';
import { useLocation, useSearchParams } from 'react-router-dom';

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

    // — Styles
    const Icon = isFusion ? Tick02Icon : BlenderIcon
    const buttonClass = clsx(
        "border-2 flex items-center justify-center",
        variant === "fab" && `joyride-fusion-btn w-16 h-16 rounded-2xl my-2 mr-1 ${(isFusion ? "joyride-generate bg-accent-2 border-border neo-shadow" : "bg-primary border-border-on-primary neo-shadow-dark")}`,
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
