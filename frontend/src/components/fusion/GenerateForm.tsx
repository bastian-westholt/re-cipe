import clsx from "clsx"
import { useFusionContext } from "../../store/fusionStore"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Tick02Icon } from "hugeicons-react"

interface GenerateFormProps {
    feedback?: boolean
}

export default function GenerateForm({ feedback=false }: GenerateFormProps) {
    const navigate = useNavigate()
    const [feedbackText, setFeedbackText] = useState('')
    const { selectedRecipes, setCurrentFusion, imageUrl, setImageUrl, setIsGenerating, setMessages, currentFusion, messages } = useFusionContext()

    function handleGenerate() {
        setIsGenerating(true)
        const nextMessages = feedback ? [
            ...messages,
            { role: "assistant", content: JSON.stringify(currentFusion) },
            { role: "user", content: feedbackText },
        ] : []
        fetch('http://127.0.0.1:5001/recipes/fusion/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipe_ids: selectedRecipes.map(r => r.id),
                ...(feedback ? { previous_fusion: currentFusion, feedback: feedbackText } : {})
            })
        })
            .then(res => res.json())
            .then(data => {
                setCurrentFusion(data)
                if (data.image_url) setImageUrl(data.image_url)
                if (feedback) setMessages(nextMessages)
                setIsGenerating(false)
            })
    }

    function handleSave() {
        fetch('http://127.0.0.1:5001/recipes/fusion/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...currentFusion,
                recipe_ids: selectedRecipes.map(r => r.id),
                image_url: imageUrl,
            })
        })
            .then(res => res.json())
            .then(data => navigate(`/recipes/${data.id}`))
    }

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
        <form className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90dvw] md:w-96 lg:w-125 flex flex-col gap-2" onSubmit={handleGenerate}>
            {feedback && (
                <textarea
                    className={textareaClass}
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                />
            )}
            <div className="flex gap-2">
                <button className={bigButtonClass} type="submit">
                    <p className="font-display -translate-x-3">{feedback ? "REGENERATE" : "GENERATE FUSION"}</p>
                </button>
                {feedback && (<button className={smallButtonClass} onClick={handleSave}>
                    <Tick02Icon />
                </button>)}
            </div>
        </form>
    )
}