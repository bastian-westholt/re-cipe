import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useRecipesStore } from "../store/recipesStore"
import TypeToggle from "../components/feed/TypeToggle"
import AvatarButton from "../components/feed/AvatarButton"
import CuisineSection from "../components/feed/CuisineSection"
import LangToggle from "../components/feed/LangToggle"

export default function FeedPage() {

    const [ searchParams ] = useSearchParams()

    const { setRecipes } = useRecipesStore()

    const type = searchParams.get('type') || 'original'

    useEffect(() => {
        fetch('http://127.0.0.1:5001/recipes')
            .then(res => res.json())
            .then(data => setRecipes(data))
    }, [])

    return (
        <>  
            <LangToggle />
            <TypeToggle activeType={type as 'original' | 'fusion'} />
            <AvatarButton />
            <div className="flex flex-col gap-10 pt-20 pb-30 px-4">
                <CuisineSection/>
            </div>
        </>
    )
}