import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { Joyride } from 'react-joyride'
import type { EventData, Step } from 'react-joyride'
import CustomTooltip from './CustomTooltip'

export default function WalktroughLayout() {

    // - Router
    const { pathname } = useLocation()

    // - State

    const [ ready, setReady ] = useState(false)

    useEffect(() => {
        setReady(false)
        const timer = setTimeout(() => setReady(true), 500)
        return () => clearTimeout(timer)
    }, [pathname])

    const tourSteps: Record<string, Step[]> = {
        "/" : [
            { target: "body", content: 'Entdecke Rezepte und kreiere eigene Fusionen!', title: 'Willkommen bei re:cipe!', placement: 'center', skipBeacon: true },
            { target: '.joyride-type-toggle', content: 'Wechsle zwischen Original-Rezepten und Fusion-Kreationen' },
            { target: '.joyride-fusion-btn', content: 'Starte den Fusion Creator und kombiniere Rezepte' },
            { target: '.joyride-search', content: 'Suche und filtere nach Küche, Schwierigkeit etc.' },
        ],
        "/fusion" : [
            { target: '.joyride-recipe-slots', content: 'Wähle 2-5 Rezepte als Basis für deine Fusion', skipBeacon: true },
            { target: '.joyride-generate', content: 'Generiere dein Fusion-Rezept' },
        ]
    }

    const seen = JSON.parse(localStorage.getItem('walktrough') || '{}')

    const steps = tourSteps[pathname]
    const shouldRun = ready && steps.length > 0 && !seen[pathname]

    function handleEvent(data: EventData) {
        console.log('joyride event:', data.type, data.status, data.action)
        if (data.status === 'finished' || data.status === 'skipped') {
            const updated = { ...seen, [pathname] : true }
            localStorage.setItem('walktrough', JSON.stringify(updated))
        }
    }

    return (
        <>
            <Outlet />
            <Joyride
                steps={steps}
                run={shouldRun}
                continuous
                onEvent={handleEvent}
                tooltipComponent={CustomTooltip}
                options={{
                    buttons: ['back', 'primary', 'skip'],
                }}
            />
        </>
    )
}