import clsx from "clsx"
import { useFusionContext } from "../../store/fusionStore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Tick02Icon } from "hugeicons-react"

export default function RegenerateForm() {

    // — Router
    const navigate = useNavigate()

    // — State
    const [feedbackText, setFeedbackText] = useState('')

    // — Store
    const { generateFusion, saveFusion } = useFusionContext()

    // — Styles
    const textareaClass = clsx(
        "w-full min-h-20 max-h-50 px-4 py-3",
        "outline-none resize-none overflow-y-scroll",
        "bg-color-2 text-color-1 border-2 border-border rounded-2xl"
    )

    const bigButtonClass = clsx(
        "w-full flex justify-center items-center",
         "bg-accent-2 text-color-1 border-2 border-border neo-shadow rounded-2xl px-4 py-4",
    )

    const smallButtonClass = clsx(
        "w-1/5 flex justify-center items-center",
        "bg-primary text-color-1 border-2 border-accent-2 neo-shadow-dark rounded-2xl px-4 py-4"
    )

    return (
        <form
            className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90dvw] md:w-96 lg:w-125 flex flex-col gap-2"
            onSubmit={(e) => { e.preventDefault(); generateFusion(feedbackText || undefined) }}
        >
            <textarea
                className={textareaClass}
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="Feedback eingeben..."
            />
            <div className="flex gap-2">
                <button className={bigButtonClass} type="submit">
                    <p className="font-display -translate-x-3">REGENERATE</p>
                </button>
                {/* type="button" verhindert Form-Submit */}
                <button type="button" className={smallButtonClass} onClick={() => saveFusion(navigate)}>
                    <Tick02Icon />
                </button>
            </div>
        </form>
    )
}
