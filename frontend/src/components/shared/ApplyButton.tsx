import { Tick02Icon } from "hugeicons-react"
import { useNavigate } from "react-router-dom"
import { useFusionContext } from "../../store/fusionStore"

interface ApplyButtonProps {
    variant?: string
}

export default function ApplyButton({ variant="default" }: ApplyButtonProps) {

    // — Router
        const navigate = useNavigate()

    if (variant === "picker") { 
        // — Store
        const { selectedRecipes } = useFusionContext()

        const isReady = selectedRecipes.length >= 2

        return (
            <button
                onClick={() => isReady && navigate(-1)}
                className={`border-2 flex items-center justify-center bg-accent-2 border-primary neo-shadow w-16 h-16 rounded-2xl my-2 mr-1 ${!isReady ? "opacity-40" : ""}`}
            >
                <Tick02Icon size={32} className="text-white" />
            </button>
        )
    } else if (variant === 'default') {
        return (
            <button className="w-full flex justify-center items-center fixed bottom-5">
                <div className="w-[90dvw] md:w-96 lg:w-125 bg-primary text-color-1 border-2 border-accent-2 neo-shadow-dark rounded-2xl px-4 py-4">
                    <p className="font-display -translate-x-3">ANWENDEN</p>
                </div>
            </button>
        )
    }
}
