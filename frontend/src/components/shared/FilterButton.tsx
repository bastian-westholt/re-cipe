import { SlidersHorizontalIcon } from "hugeicons-react"

interface FilterButtonProps{
    onOpen: () => void
}

export default function FilterButton({ onOpen }: FilterButtonProps) {
    return (
        <button onClick={onOpen} className="w-11 h-11 bg-color-2 border-2 border-border rounded-xl flex items-center justify-center">
            <SlidersHorizontalIcon size={18} className="text-color-1"/>
        </button>
    )
}
