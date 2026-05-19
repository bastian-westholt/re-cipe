import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useRecipesStore } from "../store/recipesStore"
import TypeToggle from "../components/feed/TypeToggle"
import AvatarButton from "../components/feed/AvatarButton"
import { RecipeSection } from "../components/shared/sections"
import RecipeCard from "../components/shared/sections/RecipeCard"
import LangToggle from "../components/feed/LangToggle"
import BottomNav from "../components/BottomNav"
import { useThemedRecipes } from "../hooks/useThemedRecipes"
import FeaturedCard from "../components/shared/sections/FeaturedCard"
import { useFusionContext } from "../store/fusionStore"
const API_URL = import.meta.env.VITE_API_URL

export default function FeedPage() {

    // — Store
    const [searchParams] = useSearchParams()
    const { recipes, setRecipes } = useRecipesStore()
    const type = searchParams.get('type') || 'original'
    const { isPickerActive } = useFusionContext()

    // — Themed Sections (semantic Similarity aus dem Backend)
    const wohlfuehl = useThemedRecipes("Wohlfühlküche")
    const schnellEinfach = useThemedRecipes("Schnell & Einfach")
    const streetfood = useThemedRecipes("Streetfood")
    const sonntagsbrunch = useThemedRecipes("Sonntagsbrunch")
    const romantischesDinner = useThemedRecipes("Romantisches Dinner")

    // — Effects

    // Scroll-Position laufend in sessionStorage speichern.
    // Cleanup entfernt den Listener wenn die Page unmountet — sonst läuft er im Hintergrund weiter.
    useEffect(() => {
        const saveScrollState = () => sessionStorage.setItem('feedScroll', window.scrollY.toString())
        window.addEventListener('scroll', saveScrollState)
        return () => window.removeEventListener('scroll', saveScrollState)
    }, [])

    // Scroll-Position wiederherstellen sobald Rezepte geladen sind.
    // [recipes] als Dependency: erst ausführen wenn Inhalt da ist, sonst ist die Page zu kurz zum Scrollen.
    // requestAnimationFrame: wartet einen Paint-Frame damit der Browser den Inhalt wirklich gerendert hat.
    useEffect(() => {
        if (recipes.length === 0) return
        const y = sessionStorage.getItem('feedScroll')
        if (y) requestAnimationFrame(() => window.scrollTo(0, parseInt(y)))
    }, [recipes])

    // Einmaliger Fetch aller Rezepte beim ersten Mount
    useEffect(() => {
        fetch(`${API_URL}/recipes`)
            .then(res => res.json())
            .then(data => setRecipes(data))
    }, [])

    return (
        <>
            {/* Im Picker-Mode werden TopNav-Elemente ausgeblendet — SelectionBar übernimmt die Top-Area */}
            {!isPickerActive &&
                <>
                    <LangToggle />
                    <TypeToggle activeType={type as 'original' | 'fusion'} />
                    <AvatarButton />
                </>
            }
            <div className="flex flex-col gap-10 px-4 mt-30 mb-35">
                {wohlfuehl.length > 0 && (
                    <RecipeSection title="Wohlfühlküche">
                        <RecipeSection.Carousel count={wohlfuehl.length}>
                            {wohlfuehl.map(r => <FeaturedCard key={r.id} recipe={r} />)}
                        </RecipeSection.Carousel>
                    </RecipeSection>
                )}
                {schnellEinfach.length > 0 && (
                    <RecipeSection title="Schnell & Einfach">
                        <RecipeSection.ScrollRow>
                            {schnellEinfach.map(r => <RecipeCard key={r.id} recipe={r} />)}
                        </RecipeSection.ScrollRow>
                    </RecipeSection>
                )}
                {streetfood.length > 0 && (
                    <RecipeSection title="Streetfood">
                        <RecipeSection.Carousel count={streetfood.length}>
                            {streetfood.map(r => <FeaturedCard key={r.id} recipe={r} />)}
                        </RecipeSection.Carousel>
                    </RecipeSection>
                )}
                {sonntagsbrunch.length > 0 && (
                    <RecipeSection title="Sonntagsbrunch">
                        <RecipeSection.ScrollRow>
                            {sonntagsbrunch.map(r => <RecipeCard key={r.id} recipe={r} />)}
                        </RecipeSection.ScrollRow>
                    </RecipeSection>
                )}
                {romantischesDinner.length > 0 && (
                    <RecipeSection title="Romantisches Dinner">
                        <RecipeSection.Carousel count={romantischesDinner.length}>
                            {romantischesDinner.map(r => <FeaturedCard key={r.id} recipe={r} />)}
                        </RecipeSection.Carousel>
                    </RecipeSection>
                )}
            </div>
            <BottomNav />
        </>
    )
}
