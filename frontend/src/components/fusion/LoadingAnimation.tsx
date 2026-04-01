import { BlenderIcon } from "hugeicons-react"

const PANELS = [
    { color: "#0167FE", anim: "panel-fly-a", delay: "0s",    top: "-55%", height: "210%" },
    { color: "#FD72DB", anim: "panel-fly-b", delay: "2s",    top: "-50%", height: "200%" },
    { color: "#C7EF8E", anim: "panel-fly-c", delay: "4s",    top: "-45%", height: "190%" },
    { color: "#FD72DB", anim: "panel-fly-b", delay: "6s",    top: "-52%", height: "204%" },
    { color: "#0167FE", anim: "panel-fly-a", delay: "8s",    top: "-55%", height: "210%" },
]

const DOT_GRID = "radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px)"

const STYLES = `
@keyframes slide-in-top {
  from { transform: translateY(-100%); }
  to   { transform: translateY(0); }
}

@keyframes vibrate {
  0%, 100% { transform: translateX(0)   rotate(0deg); }
  15%       { transform: translateX(-4px) rotate(-5deg); }
  30%       { transform: translateX(4px)  rotate(5deg); }
  45%       { transform: translateX(-3px) rotate(-4deg); }
  60%       { transform: translateX(3px)  rotate(4deg); }
  75%       { transform: translateX(-4px) rotate(-5deg); }
  90%       { transform: translateX(4px)  rotate(5deg); }
}

@keyframes panel-fly-a {
  0%   { transform: translateX(115%) rotate(9deg);  animation-timing-function: cubic-bezier(0.75,0,1,1); }
  10%  { transform: translateX(-14%) rotate(-3deg); animation-timing-function: cubic-bezier(0.08,0.9,0.15,1); }
  18%  { transform: translateX(0%)   rotate(0deg); }
  100% { transform: translateX(0%)   rotate(0deg); }
}
@keyframes panel-fly-b {
  0%   { transform: translateX(115%) rotate(-8deg); animation-timing-function: cubic-bezier(0.75,0,1,1); }
  10%  { transform: translateX(-14%) rotate(3deg);  animation-timing-function: cubic-bezier(0.08,0.9,0.15,1); }
  18%  { transform: translateX(0%)   rotate(0deg); }
  100% { transform: translateX(0%)   rotate(0deg); }
}
@keyframes panel-fly-c {
  0%   { transform: translateX(150%) rotate(14deg); animation-timing-function: cubic-bezier(0.75,0,1,1); }
  10%  { transform: translateX(-14%) rotate(-3deg); animation-timing-function: cubic-bezier(0.08,0.9,0.15,1); }
  18%  { transform: translateX(0%)   rotate(0deg); }
  100% { transform: translateX(0%)   rotate(0deg); }
}

/* z-index as separate animation — discrete changes don't affect transform smoothness */
@keyframes panel-z {
  0%,  40%    { z-index: 10; }
  40.1%, 100% { z-index: 1; }
}
`

export default function LoadingAnimation() {
    return (
        <div className="fixed inset-0 overflow-hidden bg-color-2" style={{ animation: "slide-in-top 0.5s cubic-bezier(0.08,0.9,0.15,1) forwards" }}>
            <style>{STYLES}</style>

            {/* — Static green base (oversized like animated panels, no rotation leak) */}
            <div
                className="absolute"
                style={{
                    backgroundColor: "#FFFDF5",
                    border: "3px solid #000",
                    backgroundImage: DOT_GRID,
                    backgroundSize: "24px 24px",
                    top: "-45%",
                    left: "-5%",
                    width: "110%",
                    height: "190%",
                    zIndex: 0,
                }}
            />

            {/* — Panels: colored + black border + dot-grid texture */}
            {PANELS.map((p, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{
                        backgroundColor: p.color,
                        border: "3px solid #000",
                        backgroundImage: DOT_GRID,
                        backgroundSize: "24px 24px",
                        top: p.top,
                        left: "-5%",
                        width: "110%",
                        height: p.height,
                        animation: [
                            `${p.anim} 10s linear ${p.delay} infinite backwards`,
                            `panel-z   10s linear ${p.delay} infinite backwards`,
                        ].join(", "),
                    }}
                />
            ))}

            {/* — Neobrutalist card floating on top */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
                <div className="relative flex flex-col items-center">

                    {/* Card */}
                    <div
                        className="bg-color-1 border-2 border-color-2 rounded-2xl p-5"
                        style={{ boxShadow: "6px 6px 0 0 #000" }}
                    >
                        <div style={{ color: "#000", animation: "vibrate 0.35s linear infinite" }}>
                            <BlenderIcon size={56} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
