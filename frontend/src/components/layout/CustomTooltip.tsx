import type { TooltipRenderProps } from 'react-joyride'

export default function CustomTooltip({
    backProps,
    primaryProps,
    skipProps,
    step,
    tooltipProps,
    index,
    isLastStep,
    size,
}: TooltipRenderProps) {
    return (
        <div
            {...tooltipProps}
            className="bg-color-1 border-2 border-border rounded-2xl p-5 max-w-80"
            style={{ boxShadow: '4px 4px 0px 0px var(--color-border)' }}
        >
            {step.title && (
                <h3 className="font-display text-lg mb-2">{step.title}</h3>
            )}
            <p className="text-sm text-color-2 mb-4">{step.content}</p>
            <div className="flex justify-between items-center">
                <button
                    {...skipProps}
                    className="text-muted text-sm"
                >
                    Skip
                </button>
                <div className="flex gap-2">
                    {index > 0 && (
                        <button
                            {...backProps}
                            className="border-2 border-border rounded-xl px-4 py-2 text-sm bg-color-1 text-color-2"
                            style={{ boxShadow: '2px 2px 0px 0px var(--color-border)' }}
                        >
                            Back
                        </button>
                    )}
                    <button
                        {...primaryProps}
                        className="border-2 border-border-on-primary neo-shadow-dark rounded-xl px-4 py-2 text-sm bg-primary text-color-1"
                        style={{ outline: 'none', border: 'border-border-on-primary' }}
                    >
                        {isLastStep ? 'Los gehts!' : `Next (${index + 1}/${size})`}
                    </button>
                </div>
            </div>
        </div>
    )
}
