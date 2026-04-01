import { useNavigate } from "react-router-dom";
import { ArrowLeft02Icon } from "hugeicons-react"
import clsx from "clsx";
import { useFusionContext } from "../../store/fusionStore";

export default function BackButton() {

    const navigate = useNavigate()

    const { resetStore } = useFusionContext()

    const backButtonClass = clsx(
        "flex items-center justify-center",
        "w-11 h-11 bg-color-2 border-2 border-border rounded-xl",
        "neo-shadow-sm",
    )

    function handleClick() {
        resetStore()
        navigate(-1)
    }

    return (
        <div className={backButtonClass} onClick={handleClick}>
            <ArrowLeft02Icon color="var(--color-color-1)"/>
        </div>
    )
}
