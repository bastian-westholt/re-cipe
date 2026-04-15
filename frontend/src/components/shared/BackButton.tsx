import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft02Icon } from "hugeicons-react"
import clsx from "clsx";
import { useFusionContext } from "../../store/fusionStore";

interface BackButtonProps {
    variant?: string
}

export default function BackButton({ variant='default' }: BackButtonProps) {

    const navigate = useNavigate()

    const { resetStore } = useFusionContext()

    const { state } = useLocation()

    const backButtonClass = clsx(
        "flex items-center justify-center",
        variant === 'icon' ? "w-auto h-auto mr-1" : "w-11 h-11",
        variant !== 'icon' && "bg-color-2 border-2 border-border rounded-xl neo-shadow-sm",
    )

    function handleClick() {
        resetStore()
        if (state === "fusion") {
            navigate('/')
            return
        }
        navigate(-1)
    }

    return (
        <div className={backButtonClass} onClick={handleClick}>
            <ArrowLeft02Icon color="var(--color-color-1)"/>
        </div>
    )
}
