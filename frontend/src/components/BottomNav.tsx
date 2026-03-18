import clsx from "clsx"
import FusionButton from "./shared/FusionButton"
import AvatarButton from "./shared/AvatarButton"
import { Search01Icon } from 'hugeicons-react'

export default function BottomNav() {

    const bottomNavClass: string = clsx(
        "fixed bottom-4 left-1/2 -translate-x-1/2",
        "w-1/2 md:w-1/3 lg:w-1/4",
        "bg-surface-2 rounded-3xl",
        "flex items-center justify-evenly",
    )

    return (
        <div className={ bottomNavClass }>
            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center">
                <Search01Icon size={18} className="text-color-2"/>
            </div>
            <FusionButton variant="fab"/>
            <AvatarButton />
        </div>
    )
}