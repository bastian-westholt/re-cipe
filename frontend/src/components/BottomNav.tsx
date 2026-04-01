import clsx from "clsx"
import { useRef, useEffect } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import { useSearchStore } from "../store/searchStore"
import FusionButton from "./shared/FusionButton"
import ApplyButton from "./shared/ApplyButton"
import FilterButton from "./shared/FilterButton"
import SearchButton from "./shared/SearchButton"
import CloseButton from "./shared/CloseButton"
import { useFilterStore } from "../store/filterStore"
import FilterSheet from "./shared/FilterSheet/index"
import { getTypeBG, getTypeColor } from "../utils/styles"



export default function BottomNav() {

    const { isSearchOpen, setIsSearchOpen } = useSearchStore()
    const { isAiSearch, setIsAiSearch } = useSearchStore()
    const { isFilterOpen, setIsFilterOpen } = useFilterStore()

    const searchInputRef = useRef<HTMLInputElement>(null)

    const [searchParams, setSearchParams] = useSearchParams()
    const type = searchParams.get('type') || "original"
    const { pathname } = useLocation()
    const isPicker = pathname === '/fusion/pick'

    useEffect(() => {
        if (isSearchOpen) searchInputRef.current?.focus()
    }, [isSearchOpen])

    function queryHandler(e:React.ChangeEvent<HTMLInputElement>) {
        setSearchParams(prev => {
            prev.set("q", e.target.value)
            return prev
        })
    }

    function setParam(key:string, value:string) {
            setSearchParams(prev => {
                prev.set(key, value)
                return prev
            })
    }

    function aiSearchHandler() {
        setIsAiSearch(!isAiSearch)
    }

    let stateClass = "w-1/2 md:w-1/3 lg:w-1/4 bg-color-1 text-color-2"
    if (isSearchOpen) stateClass = "w-[90dvw] md:w-96 lg:w-[500px] bg-color-2 text-color-1 px-4 py-3"
    if (isFilterOpen) stateClass = `flex-col w-[90dvw] ${getTypeBG(type, true)} text-color-2 px-4 py-3`

    const bottomNavClass: string = clsx(
        "flex items-center justify-evenly",
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

    function renderButtomNav() {
        if (isSearchOpen) {
            return(
                <>
                    <CloseButton onClose={() => {
                        setIsSearchOpen(false)
                        setSearchParams(prev => {
                            prev.delete('q')
                            return prev
                        })
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

        if (isFilterOpen) {
            return(
                <>
                    <div className="w-full p-1">
                    <CloseButton onClose={() => {
                        setIsFilterOpen(false)
                    }}/>
                    </div>
                    <FilterSheet.Toggle filterKey="quick">QUICK</FilterSheet.Toggle> 
                    <FilterSheet.Toggle filterKey="easy">EASY</FilterSheet.Toggle> 
                    <FilterSheet.Selection filterKey="difficulty">DIFFICULTY</FilterSheet.Selection>
                    <FilterSheet.Selection filterKey="origin_country" bilingual multiple>REGION</FilterSheet.Selection>
                </>
            )
        }

        return(
            <>
                <SearchButton onOpen={() => setIsSearchOpen(true)}/>
                {isPicker ? <ApplyButton variant="picker"/> : <FusionButton variant="fab"/>}
                <FilterButton onOpen={() => setIsFilterOpen(true)}/>
            </>
        )
    }
    
    return (
        <div className={bottomNavClass}>
            {renderButtomNav()}
        </div>
    )
}
