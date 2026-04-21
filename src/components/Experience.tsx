"use client";

import { useEffect, useRef, useState } from "react";
import { useSectionScroll, ph, useIsDesktop } from "@/hooks/useParallax";
import { useInView } from "@/hooks/useInView";

/* ── Animated counter ── */
function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  const [done,  setDone]  = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    startRef.current = null;
    setDone(false);
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) { rafRef.current = requestAnimationFrame(tick); }
      else { setValue(target); setDone(true); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return { value, done };
}

function MetricWidget({ value, prefix, suffix, label, color = "#4f8ef7", delay = 0, active }: {
  value: number; prefix?: string; suffix?: string; label: string; color?: string;
  delay?: number; active: boolean;
}) {
  const [started, setStarted] = useState(false);
  const { value: n, done } = useCountUp(value, 1400, started);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  const fmt = n >= 1e6 ? `${(n/1e6).toFixed(0)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : `${n}`;

  return (
    <div className="flex flex-col gap-1">
      <div className={`text-2xl tracking-tight ${done ? "glitch-end" : ""}`} style={{ color }}>
        {prefix}{fmt}{suffix}
      </div>
      <div className="text-[9px] tracking-[0.2em] text-[#444]">{label}</div>
    </div>
  );
}

/* ── Experience data ── */
const EXPERIENCES = [
  {
    company: "AIR FRANCE INDUSTRIES",
    role:    "Data Scientist & ML Engineer",
    period:  "MAY 2026 — DEC 2026",
    tag:     "INDUSTRY · MACHINE LEARNING",
    color:   "#4f8ef7",
    bullets: [
      "Developed ML models for large-scale transportation cost prediction across logistics operations",
      "Designed end-to-end data pipelines processing operational data at enterprise scale",
      "Built interactive Streamlit dashboard for real-time data visualization and decision support",
      "Applied data-driven optimization to reduce operational costs during initial deployment",
    ],
    metrics: [
      { value:87,  suffix:"M€", label:"OPERATIONAL DATA PROCESSED", color:"#4f8ef7" },
      { value:100, prefix:"€", suffix:"K", label:"COST SAVINGS ACHIEVED", color:"#00d4aa" },
    ],
  },
  {
    company: "AIRBUS",
    role:    "Flight Systems Validation Intern",
    period:  "JUN 2024 — AUG 2024",
    tag:     "AEROSPACE · AUTOMATION",
    color:   "#00d4aa",
    bullets: [
      "Automated compliance analysis for Airbus ATA22 (auto-flight) and ATA27 (flight controls) systems",
      "Developed Python tools for systematic test processing and traceability across validation workflows",
      "Improved reporting workflows by rationalizing data extraction and decision documentation",
    ],
    metrics: undefined,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Desktop — sticky, each experience spotlighted in sequence
───────────────────────────────────────────────────────────────────────────── */
function ExperienceDesktop() {
  const { ref: wrapRef, progress } = useSectionScroll();

  /* Phase timing — header visible from start, cards reveal as you scroll */
  const headerP = 1 - ph(progress, 0.02, 0.15); // header fades out as cards appear (subtle)
  const card1In = ph(progress, 0.0,  0.30);      // card 1 slides up immediately
  const card1Sp = ph(progress, 0.42, 0.62);      // card 1 shrinks / dims for card 2
  const card2In = ph(progress, 0.52, 0.85);      // card 2 slides up

  /* Timeline line draw */
  const lineH = ph(progress, 0.0, 0.85);

  return (
    <div ref={wrapRef} id="experience" style={{ height:"300vh" }}>
      <div style={{ position:"sticky", top:0, height:"100vh", overflow:"hidden" }}
           className="relative flex flex-col items-center justify-center">

        {/* Background hint */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity:0.02 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="exp-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#00d4aa" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#exp-grid)" />
          </svg>
        </div>

        {/* Section header */}
        <div className="absolute top-16 left-0 right-0 text-center pointer-events-none select-none"
             style={{ opacity: headerP, transform:`translateY(${(1-headerP)*20}px)` }}>
          <div className="text-[9px] tracking-[0.5em] text-[#444] mb-3">— PROFESSIONAL EXPERIENCE —</div>
          <h2 className="text-3xl xl:text-4xl tracking-[0.07em] text-[#f0f0f0]">
            WHERE DATA MEETS <span className="text-[#4f8ef7]">IMPACT</span>
          </h2>
        </div>

        {/* Cards + timeline layout */}
        <div className="w-full max-w-5xl mx-auto px-6 flex items-center gap-12 mt-20">

          {/* Timeline line */}
          <div className="hidden lg:flex flex-col items-center flex-shrink-0" style={{ height: 360 }}>
            <div className="relative w-px flex-1 bg-[#161616]">
              {/* Drawn line */}
              <div className="absolute top-0 left-0 w-px bg-gradient-to-b from-[#4f8ef7] to-[#00d4aa]"
                   style={{ height:`${lineH*100}%`, transition:"none" }} />
              {/* Dots */}
              {EXPERIENCES.map((exp, i) => (
                <div key={i} className="absolute left-[1px]"
                     style={{ top: i === 0 ? "10%" : "65%", transform:"translateX(-50%)" }}>
                  <div className="w-2 h-2 rounded-full border transition-all duration-500"
                       style={{
                         background:    (i===0 ? card1In : card2In) > 0.3 ? exp.color : "#161616",
                         borderColor:   exp.color + "60",
                         boxShadow:     (i===0 ? card1In : card2In) > 0.3 ? `0 0 10px ${exp.color}60` : "none",
                       }} />
                </div>
              ))}
            </div>
          </div>

          {/* Cards column */}
          <div className="flex-1 relative" style={{ height: 360 }}>

            {/* Card 1 */}
            <div className="absolute inset-0"
                 style={{
                   opacity:   card1In * (1 - card1Sp * 0.65),
                   transform: `translateY(${(1-card1In)*40 - card1Sp*8}px) scale(${1 - card1Sp*0.02})`,
                 }}>
              <ExperienceCardDesktop exp={EXPERIENCES[0]} active={card1In > 0.5} />
            </div>

            {/* Card 2 */}
            <div className="absolute inset-0"
                 style={{
                   opacity:   card2In,
                   transform: `translateY(${(1-card2In)*50}px)`,
                   pointerEvents: card2In > 0.1 ? "auto" : "none",
                 }}>
              <ExperienceCardDesktop exp={EXPERIENCES[1]} active={card2In > 0.5} />
            </div>
          </div>
        </div>

        {/* Scroll hint at bottom */}
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none"
             style={{ opacity: Math.max(0, 1 - progress * 6), transition:"none" }}>
          <div className="text-[8px] tracking-[0.3em] text-[#333]">SCROLL TO REVEAL</div>
        </div>
      </div>
    </div>
  );
}

function ExperienceCardDesktop({ exp, active }: { exp: typeof EXPERIENCES[0]; active: boolean }) {
  return (
    <div className="h-full border border-[#1c1c1c] rounded-sm p-8 group hover:border-[#2a2a2a] transition-colors duration-300 overflow-y-auto"
         style={{ background:"linear-gradient(135deg,#0a0a0a 0%,#050505 100%)" }}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{ background:`linear-gradient(90deg, transparent, ${exp.color}, transparent)` }} />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-[9px] tracking-[0.3em] mb-1" style={{ color: exp.color }}>{exp.tag}</div>
          <h3 className="text-xl tracking-[0.05em] text-[#f0f0f0] mb-1">{exp.company}</h3>
          <div className="text-sm text-[#666]">{exp.role}</div>
        </div>
        <div className="text-[9px] tracking-[0.2em] text-[#444] whitespace-nowrap">{exp.period}</div>
      </div>

      <ul className="space-y-2 mb-5">
        {exp.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-xs text-[#666] leading-relaxed">
            <span className="text-[#333] mt-0.5 flex-shrink-0">—</span><span>{b}</span>
          </li>
        ))}
      </ul>

      {exp.metrics && (
        <div className="border-t border-[#1c1c1c] pt-5 grid grid-cols-2 gap-6">
          {exp.metrics.map((m, i) => (
            <MetricWidget key={i} value={m.value} prefix={m.prefix} suffix={m.suffix}
              label={m.label} color={m.color} delay={i*200} active={active} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mobile — simple stacked cards with useInView
───────────────────────────────────────────────────────────────────────────── */
function ExperienceCardMobile({ exp, delay = 0 }: { exp: typeof EXPERIENCES[0]; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="border border-[#1c1c1c] rounded-sm p-6 relative overflow-hidden"
         style={{
           background: "linear-gradient(135deg,#0a0a0a 0%,#050505 100%)",
           opacity:   inView ? 1 : 0,
           transform: inView ? "none" : "translateY(24px)",
           transition:`opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
         }}>
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background:`linear-gradient(90deg, transparent, ${exp.color}60, transparent)` }} />

      <div className="mb-4">
        <div className="text-[9px] tracking-[0.3em] mb-1" style={{ color: exp.color }}>{exp.tag}</div>
        <h3 className="text-lg tracking-[0.04em] text-[#f0f0f0] mb-0.5">{exp.company}</h3>
        <div className="text-xs text-[#666] mb-1">{exp.role}</div>
        <div className="text-[9px] tracking-[0.2em] text-[#444]">{exp.period}</div>
      </div>

      <ul className="space-y-2 mb-4">
        {exp.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[#666] leading-relaxed">
            <span className="text-[#333] mt-0.5 flex-shrink-0">—</span><span>{b}</span>
          </li>
        ))}
      </ul>

      {exp.metrics && (
        <div className="border-t border-[#1c1c1c] pt-4 grid grid-cols-2 gap-4">
          {exp.metrics.map((m, i) => (
            <MetricWidget key={i} value={m.value} prefix={m.prefix} suffix={m.suffix}
              label={m.label} color={m.color} delay={i*200} active={inView} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceMobile() {
  const { ref, inView } = useInView();
  return (
    <section id="experience" className="py-24 px-6 max-w-2xl mx-auto">
      <div ref={ref}>
        <div className="text-[9px] tracking-[0.45em] text-[#444] mb-3 text-center"
             style={{ opacity:inView?1:0, transition:"opacity 0.6s" }}>
          — PROFESSIONAL EXPERIENCE —
        </div>
        <h2 className="text-2xl tracking-[0.07em] text-center text-[#f0f0f0] mb-12"
            style={{ opacity:inView?1:0, transform:inView?"none":"translateY(10px)",
                     transition:"opacity 0.6s ease 100ms, transform 0.6s ease 100ms" }}>
          WHERE DATA MEETS <span className="text-[#4f8ef7]">IMPACT</span>
        </h2>
      </div>
      <div className="space-y-5">
        {EXPERIENCES.map((exp, i) => (
          <ExperienceCardMobile key={i} exp={exp} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Export
───────────────────────────────────────────────────────────────────────────── */
export default function Experience() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <ExperienceDesktop /> : <ExperienceMobile />;
}
