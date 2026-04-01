
export const getTypeBG = (type: string | null, inverted = false) => {
    const isOriginal = type === "original"
    const showAccent2 = inverted ? !isOriginal : isOriginal
    return showAccent2 ? "bg-accent-2" : "bg-accent-1"
}

export const getTypeColor = (type: string | null, inverted = false) => {
    const isOriginal = type === "original"
    const showAccent2 = inverted ? !isOriginal : isOriginal
    return showAccent2 ? "text-accent-2" : "text-accent-1"
}

export const getTypePara = (type: string | null, inverted = false) => {
    const isOriginal = type === "original"
    const showAccent2 = inverted ? !isOriginal : isOriginal
    return showAccent2 ? "text-color-2" : "text-color-1"
}