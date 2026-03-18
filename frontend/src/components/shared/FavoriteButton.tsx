import clsx from 'clsx'
import { FavouriteIcon } from 'hugeicons-react'

interface FavoriteButtonProps {
  variant: "detail" | "card";
}

export default function FavoriteButton({ variant }: FavoriteButtonProps) {

    const buttonClass = clsx(
        "bg-color-1 flex items-center justify-center",
        variant === "detail" ? "w-16 h-16 rounded-3xl my-2" : "w-12 h-12 rounded-full",
        "hover"
    )

    return (
        <div className={buttonClass}>
            <FavouriteIcon size={variant === "detail" ? 32 : 22} className='text-color-2 -translate-x-px hover:border-2' />
        </div>
    )
}