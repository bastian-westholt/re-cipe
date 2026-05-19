import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useRecipesStore } from "../store/recipesStore"
import TypeToggle from "../components/feed/TypeToggle"
import AvatarButton from "../components/feed/AvatarButton"
import { RecipeSection } from "../components/shared/sections"
import BottomNav from "../components/BottomNav"
import { useFusionContext } from "../store/fusionStore"
import BackButton from "../components/shared/BackButton"
const API_URL = import.meta.env.VITE_API_URL

export default function BrowsePage() {

    // — Store
    const [searchParams] = useSearchParams()
    const { recipes, setRecipes } = useRecipesStore()
    const type = searchParams.get('type') || 'original'
    const { isPickerActive } = useFusionContext()

    // — Effects

    // Scroll-Position laufend speichern — identisches Pattern wie FeedPage
    useEffect(() => {
        const saveScrollState = () => sessionStorage.setItem('browseScroll', window.scrollY.toString())
        window.addEventListener('scroll', saveScrollState)
        return () => window.removeEventListener('scroll', saveScrollState)
    }, [])

    // Scroll-Position wiederherstellen sobald Rezepte da sind
    useEffect(() => {
        if (recipes.length === 0) return
        const y = sessionStorage.getItem('browseScroll')
        if (y) requestAnimationFrame(() => window.scrollTo(0, parseInt(y)))
    }, [recipes])

    // Fetch nur wenn der Store noch leer ist — Rezepte werden global gecacht (recipesStore)
    useEffect(() => {
        if (recipes.length > 0) return
        fetch(`${API_URL}/recipes`)
            .then(res => res.json())
            .then(data => setRecipes(data))
    }, [])

    return (
        <>
            {/* Im Picker-Mode TopNav ausblenden */}
            {!isPickerActive &&
                <>
                    <div className="fixed left-5 top-5 z-11">
                        <BackButton />
                    </div>
                    <TypeToggle activeType={type as 'original' | 'fusion'} />
                    <AvatarButton />
                </>
            }
            <div className="flex flex-col gap-10 px-4 mt-30 mb-35">
                {/* CuisineSection liest type + activeFilters + Suchbegriff selbst aus den URL-Params */}
                <RecipeSection.Cuisine />
            </div>
            <BottomNav />
        </>
    )
}
