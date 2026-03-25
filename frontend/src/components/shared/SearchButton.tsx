import { Search01Icon } from "hugeicons-react"

interface SearchButtonProps {
    onOpen: () => void
}

export default function SearchButton({ onOpen }: SearchButtonProps) {
    return(
        <button onClick={onOpen} className="w-11 h-11 bg-color-2 border-2 border-border rounded-xl flex items-center justify-center">
            <Search01Icon size={18} className="text-color-1"/>
        </button>
    )
}