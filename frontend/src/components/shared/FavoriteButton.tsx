import clsx from 'clsx'
import { FavouriteIcon } from 'hugeicons-react'

interface FavoriteButtonProps {
  variant: "detail" | "card";
}

export default function FavoriteButton({ variant }: FavoriteButtonProps) {

    const buttonClass = clsx(
        "bg-accent-2 border-2 border-border flex items-center justify-center",
        "neo-shadow-sm",
        variant === "detail" ? "w-16 h-16 rounded-2xl my-2" : "w-12 h-12 rounded-xl",
    )

    return (
        <div className={buttonClass}>
            <FavouriteIcon size={variant === "detail" ? 32 : 22} className='text-black' />
        </div>
    )
}
