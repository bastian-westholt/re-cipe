import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft02Icon } from "hugeicons-react"
import clsx from "clsx";
import { useFusionContext } from "../../store/fusionStore";
import { useFilterStore } from "../../store/filterStore";

interface BackButtonProps {
    variant?: string
}

export default function BackButton({ variant='default' }: BackButtonProps) {

    // — Router
    const navigate = useNavigate()
    const location = useLocation()

    // — Store
    const { resetFusionStore } = useFusionContext()
    const { resetFilterStore } = useFilterStore()

    // — Styles
    const backButtonClass = clsx(
        "flex items-center justify-center",
        variant === 'icon' ? "w-auto h-auto mr-1" : "w-11 h-11",
        variant !== 'icon' && "bg-color-2 border-2 border-border rounded-xl neo-shadow-sm",
    )

    function handleClick() {
        // Stores cleanen damit kein veralteter State auf der Zielseite landet
        resetFusionStore()
        resetFilterStore()
        // location.state?.from wird beim Navigieren mitgegeben (z.B. aus BottomNav oder Cards).
        // Fallback zu "/" wenn kein from-State vorhanden ist.
        navigate(location.state?.from ?? "/")
    }

    return (
        <div className={backButtonClass} onClick={handleClick}>
            <ArrowLeft02Icon color="var(--color-color-1)"/>
        </div>
    )
}
