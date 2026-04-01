import clsx from 'clsx'
import { BlenderIcon } from 'hugeicons-react'
import { getTypeBG, getTypeColor, getTypePara } from '../../utils/styles';
import { useSearchParams } from 'react-router-dom';

interface FusionButtonProps {
    variant: "fab" | "card" | "mini";
}

export default function FusionButton({ variant }: FusionButtonProps) {

    // — Router
    const [ searchParams ] = useSearchParams()
    const type = searchParams.get('type')

    // — Styles
    const buttonClass = clsx(
        "border-2 flex items-center justify-center",
        variant === "fab" && "bg-primary border-border-on-primary neo-shadow-dark w-16 h-16 rounded-2xl my-2 mr-1",
        variant === "card" && `${getTypeBG(type)} border-primary neo-shadow-sm w-12 h-12 rounded-xl`,
        variant === "mini" && `${getTypeBG(type)} border-primary neo-shadow-sm w-8 h-8 rounded-lg`,
    )

    const iconColor = variant === "fab" ? "text-white" : getTypePara(type, true)

    return (
        <button className={buttonClass}>
            <BlenderIcon size={variant === "fab" ? 32 : variant === "card" ? 22 : 16} className={iconColor} />
        </button>
    )
}
