import clsx from "clsx"
import { useRef, useEffect } from "react"
import { useSearchParams, useLocation, useNavigate } from "react-router-dom"
import { useSearchStore } from "../store/searchStore"
import FusionButton from "./shared/FusionButton"
import ApplyButton from "./shared/ApplyButton"
import FilterButton from "./shared/FilterButton"
import SearchButton from "./shared/SearchButton"
import CloseButton from "./shared/CloseButton"
import { useFilterStore } from "../store/filterStore"
import FilterSheet from "./shared/FilterSheet/index"
import { getTypeBG, getTypeColor } from "../utils/styles"
import { useFusionContext } from "../store/fusionStore"

export default function BottomNav() {

    // — Stores
    const { isSearchOpen, setIsSearchOpen, isAiSearch, setIsAiSearch } = useSearchStore()
    const { isFilterOpen, setIsFilterOpen, activeFilters } = useFilterStore()
    const { generateFusion, isPickerActive, setIsPickerActive, selectedRecipes } = useFusionContext()

    // — Router
    const [searchParams, setSearchParams] = useSearchParams()
    const type = searchParams.get('type') || "original"
    const location = useLocation()
    const navigate = useNavigate()

    // — Refs
    const searchInputRef = useRef<HTMLInputElement>(null)

    // — Derived State
    // canGenerate: Picker aktiv UND mindestens 2 Rezepte ausgewählt → Generate-Button zeigen
    const canGenerate = isPickerActive && selectedRecipes.length >= 2
    // isPicker: Auf /fusion aber Picker noch nicht aktiv → Generate direkt auslösen
    const isPicker = location.pathname === '/fusion' && !isPickerActive

    // — Effects

    // Searchbar öffnen → Input automatisch fokussieren
    useEffect(() => {
        if (isSearchOpen) searchInputRef.current?.focus()
    }, [isSearchOpen])

    // Sobald ein Filter aktiv wird und wir nicht auf /browse sind → dorthin navigieren
    useEffect(() => {
        if (Object.keys(activeFilters).length > 0 && location.pathname !== '/browse') {
            navigate('/browse', { state: { from: location.pathname } })
        }
    }, [activeFilters])

    // — Handler

    // Navigate und setSearchParams können nicht separat aufgerufen werden:
    // navigate wechselt die Route, setSearchParams würde auf der alten Route landen.
    // Lösung: Params direkt in navigate einbauen → alles in einem Schritt.
    function queryHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        const params = new URLSearchParams(searchParams) // aktuelle Params kopieren
        params.set('q', value)
        if (value && location.pathname !== '/browse') {
            navigate({ pathname: '/browse', search: params.toString() }, { state: { from: location.pathname } })
        } else {
            setSearchParams(params) // schon auf /browse → nur Params updaten
        }
    }

    function setParam(key: string, value: string) {
        if (location.pathname !== '/browse') {
            navigate('/browse', { state: { from: location.pathname } })
        }
        setSearchParams(prev => {
            prev.set(key, value)
            return prev
        })
    }

    function aiSearchHandler() {
        setIsAiSearch(!isAiSearch)
    }

    // — Styles
    // stateClass ändert die BottomNav-Größe und -Farbe je nach aktivem Modus
    let stateClass = "w-1/2 md:w-1/3 lg:w-1/4 bg-color-1 text-color-2"
    if (isSearchOpen) stateClass = "w-[90dvw] md:w-96 lg:w-[500px] bg-color-2 text-color-1 px-4 py-3"
    if (isFilterOpen) stateClass = `flex-col w-[90dvw] ${getTypeBG(type, true)} text-color-2 px-4 py-3`

    const bottomNavClass: string = clsx(
        "joyride-search flex items-center justify-evenly",
        "fixed bottom-5 left-1/2 -translate-x-1/2",
        stateClass,
        "transition-all duration-200 ease-in-out",
        "border-2 border-border rounded-2xl",
        "neo-shadow z-10",
    )

    const aiSearchClass = clsx(
        "w-11 h-11 flex items-center justify-center",
        "font-display",
        isAiSearch ? getTypeColor(type, true) : "text-muted"
    )

    // — Render (drei Modi: Search / Filter / Default)
    function renderButtomNav() {

        // Modus 1: Suchleiste offen
        if (isSearchOpen) {
            return(
                <>
                    <CloseButton onClose={() => {
                        setIsSearchOpen(false)
                        setSearchParams(prev => { prev.delete('q'); return prev })
                    }}/>
                    <form className="w-full pl-4">
                        <input ref={searchInputRef} onChange={queryHandler} className="w-full h-full outline-none" type="text" />
                    </form>
                    <div onClick={aiSearchHandler} className={aiSearchClass}>
                        <p>AI</p>
                    </div>
                </>
            )
        }

        // Modus 2: Filter-Sheet offen
        if (isFilterOpen) {
            return(
                <>
                    <div className="w-full p-1">
                        <CloseButton onClose={() => setIsFilterOpen(false)} />
                    </div>
                    <FilterSheet.Toggle filterKey="quick">QUICK</FilterSheet.Toggle>
                    <FilterSheet.Toggle filterKey="easy">EASY</FilterSheet.Toggle>
                    <FilterSheet.Selection filterKey="difficulty">DIFFICULTY</FilterSheet.Selection>
                    <FilterSheet.Selection filterKey="origin_country" bilingual multiple>REGION</FilterSheet.Selection>
                </>
            )
        }

        // Modus 3: Standard-Nav mit FusionButton
        // FusionButton hat drei Zustände:
        // - canGenerate: Fusion generieren + zu /fusion navigieren
        // - isPicker: direkt generateFusion aufrufen (User ist schon auf /fusion)
        // - Default: Picker-Mode aktivieren
        return(
            <>
                <SearchButton onOpen={() => setIsSearchOpen(true)} />
                <div className="joyride-generate">
                    {canGenerate
                        ? <FusionButton variant="fab" onClick={() => { generateFusion(); setIsPickerActive(false); navigate('/fusion', { state: { from: location.pathname }}) }} />
                        : isPicker
                            ? <FusionButton variant="fab" onClick={() => generateFusion()} />
                            : <FusionButton variant="fab" onClick={() => setIsPickerActive(true)} />
                    }
                </div>
                <FilterButton onOpen={() => setIsFilterOpen(true)} />
            </>
        )
    }

    return (
        <div className={bottomNavClass}>
            {renderButtomNav()}
        </div>
    )
}
