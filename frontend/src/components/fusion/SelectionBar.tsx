import { ArrowLeft02Icon } from "hugeicons-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useFusionContext } from "../../store/fusionStore"

export default function SelectionBar() {

    // — Store
    const { isPickerActive, selectedRecipes, setSelectedRecipes, resetFusionStore } = useFusionContext()

    // — Router
    const { pathname } = useLocation()
    const navigate = useNavigate()

    // SelectionBar nur rendern wenn Picker aktiv ist
    if (!isPickerActive) return null

    function handleBack() {
        resetFusionStore()
        // Nur zu / navigieren wenn wir auf /fusion sind — auf anderen Seiten bleibt der User wo er ist
        if (pathname === '/fusion') navigate('/')
    }

    return (
        <div className="joyride-recipe-slots fixed min-h-19 top-4 left-1/2 -translate-x-1/2 w-[90dvw] bg-color-2 border-2 border-border rounded-2xl neo-shadow px-4 py-3 flex items-center gap-3 z-11">
            <div className="flex items-center justify-center w-auto h-auto mr-1 cursor-pointer"
                onClick={handleBack}>
                <ArrowLeft02Icon color="var(--color-color-1)" />
            </div>
            <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide items-center">
                {selectedRecipes.length === 0 && (
                    <p className="text-muted text-sm">Wähle 2–5 Rezepte</p>
                )}
                {selectedRecipes.map(r => (
                    // Klick auf ein Rezept-Bild entfernt es aus der Auswahl
                    <div
                        key={r.id}
                        onClick={() => setSelectedRecipes(selectedRecipes.filter(s => s.id !== r.id))}
                        className="w-12 h-12 rounded-xl border-2 border-border overflow-hidden shrink-0 cursor-pointer"
                    >
                        <img className="w-full h-full object-cover" src={r.image_url} alt="" />
                    </div>
                ))}
            </div>
        </div>
    )
}
