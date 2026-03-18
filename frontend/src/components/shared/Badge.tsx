import clsx from "clsx"
import type { ReactNode } from 'react'

interface BadgeProps {
    label: string | number
    icon?: ReactNode
    variant: 'primary' | 'default'
}

export default function Badge({ label, icon, variant }: BadgeProps) {

    const badgeClass = clsx(
        variant === 'primary'
                ? 'bg-primary text-color-1' 
                : 'bg-surface',
        'rounded-full p-3',
        'flex items-center justify-center'
    )

    return(
        <div className={badgeClass}>
            <h4 className="flex items-center gap-2 whitespace-nowrap">{icon} {label}</h4>
        </div>
    )
}