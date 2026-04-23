import type { ReactNode } from "react"

export default function ScrollRow({ children }: { children: ReactNode }) {
    return (
        <div className="flex overflow-x-auto gap-3 scrollbar-hide -mx-4 px-5 py-2">
            {children}
        </div>
    )
}