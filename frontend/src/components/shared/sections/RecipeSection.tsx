import type { ReactNode } from "react"

interface RecipeSectionProps {
    title: string
    children: ReactNode
}

export default function RecipeSection({ title, children }: RecipeSectionProps) {
    return (
        <section className="flex flex-col gap-1">
            <h1 className="mb-2 font-display">{title}</h1>
            {children}
        </section>
    )
}
