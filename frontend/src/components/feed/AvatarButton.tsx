import clsx from 'clsx'
import { User03Icon,  } from 'hugeicons-react'

export default function AvatarButton() {

    const avatarButtonClass = clsx(
        "flex items-center justify-center",
        "w-11 h-11 bg-color-2 border-2 border-border rounded-xl",
        "neo-shadow-sm",
        "fixed right-5 top-5 z-11"
    )

    return (
        <div className={avatarButtonClass}>
            <User03Icon size={18} className="text-color-1"/>
        </div>
    )
}
