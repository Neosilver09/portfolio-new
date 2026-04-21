"use client";

import { useState, useEffect } from "react";
import { useSectionScroll, ph, useIsDesktop } from "@/hooks/useParallax";
import { useInView } from "@/hooks/useInView";

/* ── Orbital radius — responsive ── */
function useOrbitR() {
  const [r, setR] = useState(130);
  useEffect(() => {
    const update = () => setR(window.innerWidth < 640 ? 90 : window.innerWidth < 1024 ? 110 : 130);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return r;
}

const NODES = [
  { label: "GEORGIA TECH",  sub: "M.S. AEROSPACE ENG.",  color: "#4f8ef7", angle: -90 },
  { label: "INP-ENSEEIHT",  sub: "M.S. COMPUTER SCIENCE", color: "#00d4aa", angle:  90 },
];

const SKILLS = [
  { label:"MACHINE LEARNING",   detail:"Predictive modeling · Large-scale data · End-to-end pipelines", color:"#4f8ef7" },
  { label:"PERCEPTION SYSTEMS", detail:"Real-time sensor fusion · SLAM · State estimation (EKF)",       color:"#00d4aa" },
  { label:"SYSTEMS THINKING",   detail:"ATA22/27 validation · Embedded constraints · Hardware-aware AI", color:"#888"   },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Orbital sub-component (shared by both desktop & mobile)
───────────────────────────────────────────────────────────────────────────── */
function Orbital({ R, paused, hovered, onEnter, onLeave, onNodeEnter, onNodeLeave }: {
  R: number;
  paused: boolean; hovered: number | null;
  onEnter: () => void; onLeave: () => void;
  onNodeEnter: (i: number) => void; onNodeLeave: () => void;
}) {
  const SIZE = R * 2 + 80;
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: SIZE, height: SIZE }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Orbit rings */}
      <div className="absolute rounded-full border border-[#1c1c1c]"
           style={{ width: R*2, height: R*2, left:`calc(50% - ${R}px)`, top:`calc(50% - ${R}px)` }} />
      <div className="absolute rounded-full border border-[#111]"
           style={{ width: R*2+30, height: R*2+30, left:`calc(50% - ${R+15}px)`, top:`calc(50% - ${R+15}px)` }} />

      {/* Nodes */}
      {NODES.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const cx  = Math.round(Math.cos(rad) * R * 100) / 100;
        const cy  = Math.round(Math.sin(rad) * R * 100) / 100;
        return (
          <div key={i} className="absolute inset-0"
               style={{ animation:`${i===0?"orbit-cw":"orbit-ccw"} 18s linear infinite`,
                        animationPlayState: paused ? "paused" : "running" }}>
            <div className="absolute"
                 style={{ left:`calc(50% + ${cx}px)`, top:`calc(50% + ${cy}px)`, transform:"translate(-50%,-50%)" }}>
              <div style={{ animation:`${i===0?"orbit-ccw":"orbit-cw"} 18s linear infinite`,
                            animationPlayState: paused ? "paused" : "running" }}
                   className="flex flex-col items-center cursor-pointer"
                   onMouseEnter={() => onNodeEnter(i)}
                   onMouseLeave={onNodeLeave}>
                <div className="w-3 h-3 rounded-full transition-all duration-300"
                     style={{ background: node.color,
                              boxShadow:`0 0 ${hovered===i?24:8}px ${node.color}80`,
                              transform: hovered===i ? "scale(1.6)" : "scale(1)" }} />
                <span className="text-[8px] tracking-[0.2em] font-bold mt-1.5 whitespace-nowrap"
                      style={{ color: node.color }}>{node.label}</span>
                <span className="text-[7px] text-[#555] whitespace-nowrap mt-0.5">{node.sub}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-12 h-12 rounded-full border border-[#4f8ef7]/30 flex items-center justify-center mb-2"
             style={{ boxShadow:"0 0 30px #4f8ef720" }}>
          <div className="w-2 h-2 rounded-full bg-[#4f8ef7]" />
        </div>
        <span className="text-[8px] tracking-[0.3em] text-[#555]">AI CORE</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Desktop sticky scroll layout
───────────────────────────────────────────────────────────────────────────── */
function DualCoreDesktop() {
  const { ref: wrapRef, progress } = useSectionScroll();
  const [paused,  setPaused]  = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const R    = 130;
  const SIZE = R * 2 + 80;

  /* Phase timing — title is visible from the start, fades as orbital reveals */
  const titleOut = ph(progress, 0.18, 0.42);   // title fades out + rises
  const orbIn    = ph(progress, 0.22, 0.55);   // orbital fades + scales in
  const splitP   = ph(progress, 0.50, 0.85);   // text slides in, orbital shifts left

  const titleO = 1 - titleOut;
  const titleY = -titleOut * 50;

  /* Text container width animation (0 → 420px) collapses when invisible → orbital stays centered */
  const textW  = Math.round(splitP * 420);
  const textML = Math.round(splitP * 48);

  return (
    <div ref={wrapRef} id="about" style={{ height: "330vh" }}>
      <div style={{ position:"sticky", top:0, height:"100vh", overflow:"hidden" }}
           className="relative flex items-center justify-center">

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.025 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dc-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4f8ef7" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dc-grid)" />
          </svg>
        </div>

        {/* ── Phase 1: Big title ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
             style={{ opacity: titleO, transform: `translateY(${titleY}px)` }}>
          <div className="text-[9px] tracking-[0.55em] text-[#444] mb-8">— DUAL ACADEMIC CORE —</div>
          <h2 className="text-5xl xl:text-6xl tracking-[0.06em] text-center text-[#f0f0f0] leading-tight">
            THE DUAL&#8209;CORE<br/>
            <span className="text-[#4f8ef7]">ADVANTAGE</span>
          </h2>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-12 bg-[#1c1c1c]" />
            <span className="text-[9px] tracking-[0.3em] text-[#555]">TWO DEGREES · ONE MISSION</span>
            <div className="h-px w-12 bg-[#1c1c1c]" />
          </div>
        </div>

        {/* ── Phase 2+3: Orbital + text ── */}
        <div style={{ opacity: orbIn, transform:`scale(${0.84 + orbIn * 0.16})` }}
             className="flex items-center justify-center">

          {/* Orbital */}
          <Orbital R={R} paused={paused} hovered={hovered}
            onEnter={() => setPaused(true)}
            onLeave={() => { setPaused(false); setHovered(null); }}
            onNodeEnter={i => setHovered(i)}
            onNodeLeave={() => setHovered(null)}
          />

          {/* Text — animated width collapses to 0 when splitP=0 → orbital stays centered */}
          <div style={{ width: textW, marginLeft: textML, overflow:"hidden", flexShrink: 0 }}>
            <div style={{ width: 420, opacity: splitP, transform:`translateX(${(1-splitP)*50}px)` }}
                 className="space-y-6">
              <div>
                <div className="text-[9px] tracking-[0.45em] text-[#444] mb-3">— DUAL ACADEMIC CORE —</div>
                <h3 className="text-2xl tracking-[0.07em] text-[#f0f0f0] mb-4">
                  THE DUAL&#8209;CORE <span className="text-[#4f8ef7]">ADVANTAGE</span>
                </h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  Where most engineers operate in one domain, I operate at the intersection of two.
                  A Computer Science foundation from ENSEEIHT — algorithms, data systems, ML at scale.
                  An Aerospace layer from Georgia Tech — autonomous systems, real-time perception, and
                  physics&#8209;constrained AI.
                </p>
              </div>

              <div className="space-y-3">
                {SKILLS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-px h-9 mt-0.5 flex-shrink-0" style={{ background: item.color }} />
                    <div>
                      <div className="text-[9px] tracking-[0.28em] mb-0.5" style={{ color: item.color }}>{item.label}</div>
                      <div className="text-[11px] text-[#555]">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#1c1c1c]">
                <div className="flex gap-8">
                  {[{v:"4.0",l:"GPA / 4.0"},{v:"5+",l:"LANGUAGES"},{v:"2×",l:"M.S. DEGREES"}].map((s,i) => (
                    <div key={i}>
                      <div className="text-lg text-[#f0f0f0] mb-0.5">{s.v}</div>
                      <div className="text-[8px] tracking-[0.2em] text-[#444]">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hovered node description */}
              {hovered !== null && (
                <div className="text-[10px] text-[#555] leading-relaxed border-l border-[#1c1c1c] pl-3 italic"
                     style={{ animation:"fade-in 0.2s ease forwards" }}>
                  {["Autonomous Robotics · GPS-Denied Navigation · Systems Engineering · GPA 4.0",
                    "Machine Learning · Big Data · Algorithm Design · Large-Scale Systems"][hovered]}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mobile simple layout
───────────────────────────────────────────────────────────────────────────── */
function DualCoreMobile() {
  const { ref, inView } = useInView();
  const R   = useOrbitR();
  const [paused,  setPaused]  = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const v = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section id="about" className="py-24 px-6 max-w-lg mx-auto">
      <div ref={ref}>
        <div className="text-[9px] tracking-[0.45em] text-[#444] mb-4 text-center" style={v()}>
          — DUAL ACADEMIC CORE —
        </div>
        <h2 className="text-2xl tracking-[0.07em] text-center text-[#f0f0f0] mb-12" style={v(80)}>
          DUAL&#8209;CORE <span className="text-[#4f8ef7]">ADVANTAGE</span>
        </h2>
        <div className="flex justify-center mb-12" style={v(160)}>
          <Orbital R={R} paused={paused} hovered={hovered}
            onEnter={() => setPaused(true)}
            onLeave={() => { setPaused(false); setHovered(null); }}
            onNodeEnter={i => setHovered(i)}
            onNodeLeave={() => setHovered(null)}
          />
        </div>
        <div className="space-y-5" style={v(240)}>
          <p className="text-xs text-[#666] leading-relaxed">
            CS foundation from ENSEEIHT + Aerospace Engineering from Georgia Tech — algorithms,
            data systems, ML at scale, meeting autonomous systems and real-time perception.
          </p>
          <div className="space-y-3">
            {SKILLS.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-px h-9 mt-0.5 flex-shrink-0" style={{ background: item.color }} />
                <div>
                  <div className="text-[9px] tracking-[0.25em] mb-0.5" style={{ color: item.color }}>{item.label}</div>
                  <div className="text-[11px] text-[#555]">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-[#1c1c1c] flex gap-8">
            {[{v:"4.0",l:"GPA / 4.0"},{v:"5+",l:"LANGUAGES"},{v:"2×",l:"M.S."}].map((s,i) => (
              <div key={i}>
                <div className="text-xl text-[#f0f0f0] mb-0.5">{s.v}</div>
                <div className="text-[8px] tracking-[0.2em] text-[#444]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Export — desktop vs mobile
───────────────────────────────────────────────────────────────────────────── */
export default function DualCore() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DualCoreDesktop /> : <DualCoreMobile />;
}
