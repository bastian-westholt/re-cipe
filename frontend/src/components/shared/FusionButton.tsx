import clsx from 'clsx'
import { BlenderIcon } from 'hugeicons-react'

interface FusionButtonProps {
  variant: "fab" | "card";
}

export default function FusionButton({ variant }: FusionButtonProps) {

    const buttonClass = clsx(
        "bg-primary flex items-center justify-center",
        variant === "fab" ? "w-16 h-16 rounded-3xl my-2" : "w-12 h-12 rounded-full",
        "hover"
    )

    return (
        <div className={buttonClass}>
            <BlenderIcon size={variant === "fab" ? 32 : 22} className='text-color-1 -translate-x-px hover:border-2' />
        </div>
    )
}