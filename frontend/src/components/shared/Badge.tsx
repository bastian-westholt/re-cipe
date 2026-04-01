import clsx from "clsx"
import type { ReactNode } from 'react'

interface BadgeProps {
    label?: string | number
    icon?: ReactNode
    variant: 'primary' | 'default' | 'fusion'
}

export default function Badge({ label, icon, variant }: BadgeProps) {

    const badgeClass = clsx(
        variant === 'primary' ? 'bg-primary text-color-1'
            : variant === 'fusion' ? 'bg-accent-2 text-color-2'
            : 'bg-accent-1 text-color-2',
        'border-2 border-border rounded-xl px-4 py-2',
        'neo-shadow-sm',
        'flex items-center justify-center'
    )
    
    return(
        <div className={badgeClass}>
            <h4 className="flex items-center gap-2 whitespace-nowrap font-semibold">{icon} {label}</h4>
        </div>
    )
}
