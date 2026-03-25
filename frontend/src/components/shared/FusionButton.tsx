import clsx from 'clsx'
import { BlenderIcon } from 'hugeicons-react'

interface FusionButtonProps {
    variant: "fab" | "card";
}

export default function FusionButton({ variant }: FusionButtonProps) {

    const buttonClass = clsx(
        "bg-primary border-2 border-border-on-primary flex items-center justify-center",
        "neo-shadow-dark",
        variant === "fab" ? "w-16 h-16 rounded-2xl my-2" : "w-12 h-12 rounded-xl",
    )

    return (
        <button className={buttonClass}>
            <BlenderIcon size={variant === "fab" ? 32 : 22} className='text-white' />
        </button>
    )
}
