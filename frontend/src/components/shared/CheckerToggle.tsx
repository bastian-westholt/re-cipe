interface CheckerToggleProps {
    isSelected: boolean
}

export default function CheckerToggle({isSelected}: CheckerToggleProps) {

    return (
        isSelected
        ? 
            <div className="w-6 h-6 border-2 border-border bg-color-1/50 rounded-md absolute top-2 right-2 z-5 p-0.5">
                <div className="w-full h-full bg-accent-2 rounded-sm"></div>
            </div>
        : 
            <div className="w-6 h-6 border-2 border-border bg-color-1/50 rounded-md absolute top-2 right-2 z-5">
                <div className="w-full h-full rounded-sm"></div>
            </div>
    )
}