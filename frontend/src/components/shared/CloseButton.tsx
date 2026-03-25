import { Cancel01Icon } from 'hugeicons-react'

interface CloseButtonProps {
    onClose: () => void
}

export default function CloseButton({ onClose }: CloseButtonProps) {

    return(
        <button onClick={onClose}><Cancel01Icon /></button>
    )
}