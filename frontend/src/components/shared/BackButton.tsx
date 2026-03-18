import { useNavigate } from "react-router-dom";
import { ArrowLeft02Icon } from "hugeicons-react"
import clsx from "clsx";

export default function BackButton() {

    const navigate = useNavigate()

    const backButtonClass = clsx(
        "flex items-center justify-center",
        "w-11 h-11 bg-none",
        "left-5 top-5 z-11"
    )

    function handleClick() {
        navigate(-1)
    }

    return (
        <div className={backButtonClass} onClick={handleClick}>
            <ArrowLeft02Icon color="#000000"/>
        </div>
    )
}