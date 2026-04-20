"use client";

import { useEffect, useState } from "react";

/* ─── Floating data particles ─────────────────────────────────────── */
const PARTICLES = [
  { x: "12%",  y: "18%", label: "v_∞ = 0.82M",   delay: 0    },
  { x: "82%",  y: "14%", label: "σ = 0.0031",     delay: 400  },
  { x: "8%",   y: "68%", label: "λ = 1.064μm",    delay: 800  },
  { x: "88%",  y: "72%", label: "Δt = 2.4ms",      delay: 200  },
  { x: "76%",  y: "44%", label: "F1 = 0.94",       delay: 600  },
  { x: "18%",  y: "44%", label: "ε = 0.0012",      delay: 1000 },
];

/* ─── Per-letter reveal ───────────────────────────────────────────── */
function AnimatedWord({ word, started, baseDelay }: {
  word: string; started: boolean; baseDelay: number;
}) {
  return (
    <div className="flex justify-center">
      {word.split("").map((char, i) => (
        <span key={i} className="inline-block" style={{
          opacity:   started ? 1 : 0,
          transform: started ? "translateY(0)" : "translateY(28px)",
          filter:    started ? "blur(0px)" : "blur(8px)",
          transition:`opacity 0.55s cubic-bezier(.16,1,.3,1) ${baseDelay + i * 40}ms,
                      transform 0.55s cubic-bezier(.16,1,.3,1) ${baseDelay + i * 40}ms,
                      filter 0.45s ease ${baseDelay + i * 40}ms`,
        }}>
          {char}
        </span>
      ))}
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────── */
export default function Hero() {
  const [started,    setStarted]    = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const [glitch,     setGlitch]     = useState(false);
  const [particles,  setParticles]  = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStarted(true),    300);
    const t2 = setTimeout(() => setSubVisible(true), 1350);
    const t3 = setTimeout(() => { setGlitch(true);  }, 1080);
    const t4 = setTimeout(() => { setGlitch(false); }, 1230);
    const t5 = setTimeout(() => setParticles(true),  1600);
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, []);

  return (
    <section id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── SVG precision grid ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4f8ef7" strokeWidth="0.4"/>
          </pattern>
          {/* finer sub-grid */}
          <pattern id="subgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4f8ef7" strokeWidth="0.15"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#subgrid)" opacity="0.025"/>
        <rect width="100%" height="100%" fill="url(#grid)"    opacity="0.045"/>
        {/* diagonal precision lines */}
        <line x1="0"    y1="0" x2="26%"  y2="36%" stroke="#4f8ef7" strokeWidth="0.4" opacity="0.04"/>
        <line x1="100%" y1="0" x2="74%"  y2="36%" stroke="#4f8ef7" strokeWidth="0.4" opacity="0.04"/>
        <line x1="0"   y1="100%" x2="26%"  y2="64%" stroke="#4f8ef7" strokeWidth="0.3" opacity="0.025"/>
        <line x1="100%" y1="100%" x2="74%" y2="64%" stroke="#4f8ef7" strokeWidth="0.3" opacity="0.025"/>
        {/* corner crosshairs — top-left */}
        <g stroke="#4f8ef7" strokeWidth="0.8" opacity="0.22">
          <line x1="28" y1="26" x2="58" y2="26"/><line x1="43" y1="11" x2="43" y2="41"/>
          <circle cx="43" cy="26" r="2" fill="none" opacity="0.5"/>
        </g>
        {/* corner crosshairs — top-right */}
        <g stroke="#4f8ef7" strokeWidth="0.8" opacity="0.22">
          <line x1="calc(100% - 28px)" y1="26" x2="calc(100% - 58px)" y2="26"/>
          <line x1="calc(100% - 43px)" y1="11" x2="calc(100% - 43px)" y2="41"/>
        </g>
        {/* Reticle rings at center */}
        <circle cx="50%" cy="50%" r="180" fill="none" stroke="#4f8ef7" strokeWidth="0.3" opacity="0.04"/>
        <circle cx="50%" cy="50%" r="280" fill="none" stroke="#4f8ef7" strokeWidth="0.3" opacity="0.025"/>
        {/* tick marks on outer ring — values pre-rounded to avoid SSR/client float mismatch */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
          const rad = deg * Math.PI / 180;
          const r1 = 276, r2 = 284;
          const f = (n: number) => Math.round(n * 100) / 100;
          return (
            <line key={deg}
              x1={`calc(50% + ${f(Math.cos(rad)*r1)}px)`} y1={`calc(50% + ${f(Math.sin(rad)*r1)}px)`}
              x2={`calc(50% + ${f(Math.cos(rad)*r2)}px)`} y2={`calc(50% + ${f(Math.sin(rad)*r2)}px)`}
              stroke="#4f8ef7" strokeWidth="0.6" opacity="0.1"/>
          );
        })}
      </svg>

      {/* ── Radar rings ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[0,1,2,3].map(i => (
          <div key={i} className="absolute rounded-full border border-[#4f8ef7]"
            style={{ width:`${(i+1)*20}vw`, height:`${(i+1)*20}vw`,
              opacity:0, animation:`radar-ring 4s ease-out ${i*0.85}s infinite`}}/>
        ))}
      </div>

      {/* ── Scan line ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div style={{
          position:"absolute", left:0, right:0, height:"1px",
          background:"linear-gradient(90deg, transparent 0%, #4f8ef7 30%, #4f8ef7 70%, transparent 100%)",
          opacity: 0.12,
          animation:"scanline 6s linear infinite",
        }}/>
      </div>

      {/* ── Floating data particles ── */}
      {PARTICLES.map((p, i) => (
        <div key={i}
          className="absolute pointer-events-none select-none hidden md:block"
          style={{
            left: p.x, top: p.y,
            opacity: particles ? 1 : 0,
            transform: particles ? "translateY(0)" : "translateY(-10px)",
            transition:`opacity 0.6s ease ${p.delay}ms, transform 0.6s ease ${p.delay}ms`,
            animation: particles ? `float-particle ${3.5 + i * 0.4}s ease-in-out ${p.delay}ms infinite` : "none",
          }}>
          <span style={{
            fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace",
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: "#4f8ef7",
            opacity: 0.35,
          }}>
            {p.label}
          </span>
        </div>
      ))}

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{background:"radial-gradient(ellipse at center, transparent 25%, #050505 85%)"}}/>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-4xl">

        {/* Status chip */}
        <div className="flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-[#1c1c1c] text-[10px] tracking-[0.3em] text-[#555]"
          style={{ opacity:subVisible?1:0, transition:"opacity 0.5s ease"}}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7]"
            style={{animation:"blink-dot 2s ease-in-out infinite"}}/>
          AVAILABLE · AI ENGINEER ROLES
        </div>

        {/* ── Name with HUD brackets ── */}
        <div className="relative inline-block mb-2">
          {/* HUD corners */}
          {started && ["top-left","top-right","bottom-left","bottom-right"].map((pos, i) => {
            const isTop  = pos.includes("top");
            const isLeft = pos.includes("left");
            return (
              <span key={pos} className="absolute w-5 h-5 pointer-events-none"
                style={{
                  top:    isTop  ? -10 : "auto",
                  bottom: !isTop ? -10 : "auto",
                  left:   isLeft ? -10 : "auto",
                  right:  !isLeft? -10 : "auto",
                  borderTop:    isTop    ? "1.5px solid #4f8ef7" : "none",
                  borderBottom: !isTop   ? "1.5px solid #4f8ef7" : "none",
                  borderLeft:   isLeft   ? "1.5px solid #4f8ef7" : "none",
                  borderRight:  !isLeft  ? "1.5px solid #4f8ef7" : "none",
                  opacity: 0,
                  animation:`fade-in 0.4s ease ${580 + i*70}ms forwards`,
                }}/>
            );
          })}

          {/* Side axis labels */}
          {started && (
            <>
              <span className="absolute pointer-events-none hidden sm:block"
                style={{
                  right: "calc(100% + 18px)", top: "50%", transform: "translateY(-50%) rotate(-90deg)",
                  fontSize: "7px", letterSpacing: "0.3em", color: "#4f8ef7", opacity: 0,
                  animation: "fade-in 0.4s ease 900ms forwards",
                  whiteSpace: "nowrap",
                }}>
                ID·001
              </span>
              <span className="absolute pointer-events-none hidden sm:block"
                style={{
                  left: "calc(100% + 18px)", top: "50%", transform: "translateY(-50%) rotate(90deg)",
                  fontSize: "7px", letterSpacing: "0.3em", color: "#4f8ef7", opacity: 0,
                  animation: "fade-in 0.4s ease 900ms forwards",
                  whiteSpace: "nowrap",
                }}>
                2026
              </span>
            </>
          )}

          <h1
            className="leading-[0.9] tracking-[0.12em] select-none"
            style={{
              fontSize:"clamp(2.6rem, 7.5vw, 5.2rem)",
              color: glitch ? "#4f8ef7" : "#f0f0f0",
              textShadow: glitch
                ? "0 0 30px rgba(79,142,247,0.8), -2px 0 #00d4aa, 2px 0 #f7a24f"
                : started ? "0 0 60px rgba(79,142,247,0.06)" : "none",
              filter: glitch ? "hue-rotate(25deg)" : "none",
              transition:"color 0.05s, filter 0.05s, text-shadow 0.12s",
            }}
          >
            <AnimatedWord word="ANISHAN"    started={started} baseDelay={0}/>
            <AnimatedWord word="SEBANATHAN" started={started} baseDelay={160}/>
          </h1>

          {/* Shimmer underline */}
          <div style={{
            height: "1px", marginTop: 14,
            background:"linear-gradient(90deg, transparent 0%, #4f8ef7 30%, #00d4aa 60%, transparent 100%)",
            backgroundSize:"200% 100%",
            opacity: started ? 1 : 0,
            transition:"opacity 0.6s ease 900ms",
            animation: started ? "shimmer-line 3s ease-in-out 1s infinite" : "none",
          }}/>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-center gap-3 md:gap-5 mt-6 mb-3"
          style={{opacity:subVisible?1:0, transition:"opacity 0.6s ease 0.1s"}}>
          <span className="text-sm md:text-base tracking-[0.35em] text-[#4f8ef7] whitespace-nowrap">AI ENGINEER</span>
          <span className="text-[#333]">/</span>
          <span className="text-sm md:text-base tracking-[0.35em] text-[#555] whitespace-nowrap">ML SPECIALIST</span>
        </div>

        {/* Credential line — compact on mobile, full on md+ */}
        <p className="text-[9px] tracking-[0.22em] text-[#3a3a3a] mb-10"
          style={{opacity:subVisible?1:0, transition:"opacity 0.6s ease 0.2s"}}>
          <span className="hidden md:inline">GEORGIA TECH M.S. AEROSPACE&nbsp;&nbsp;·&nbsp;&nbsp;INP-ENSEEIHT M.S. CS&nbsp;&nbsp;·&nbsp;&nbsp;GPA 4.0</span>
          <span className="md:hidden">GT M.S. AEROSPACE&nbsp;·&nbsp;ENSEEIHT M.S. CS&nbsp;·&nbsp;GPA 4.0</span>
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap justify-center"
          style={{opacity:subVisible?1:0, transform:subVisible?"translateY(0)":"translateY(10px)",
            transition:"opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s"}}>
          <a href="#projects"
            className="group relative px-6 py-2.5 text-[10px] tracking-[0.3em] bg-[#4f8ef7] text-[#050505] font-bold rounded-sm overflow-hidden"
            style={{transition:"background 0.2s"}}>
            <span className="relative z-10">VIEW PROJECTS</span>
            <span className="absolute inset-0 bg-[#7aaeff] opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
          </a>
          <a href="#contact"
            className="px-6 py-2.5 text-[10px] tracking-[0.3em] border border-[#222] text-[#555] rounded-sm hover:border-[#4f8ef7] hover:text-[#f0f0f0] transition-all duration-200">
            CONTACT
          </a>
        </div>

        {/* Metrics strip */}
        <div className="flex items-center justify-center gap-10 md:gap-20 mt-14 pt-7 border-t border-[#111] w-full max-w-md"
          style={{opacity:subVisible?1:0, transition:"opacity 0.6s ease 0.5s"}}>
          {[
            {value:"4.0",   label:"GPA / GEORGIA TECH"},
            {value:"€87M",  label:"DATA PROCESSED"},
            {value:"€100K", label:"SAVINGS DELIVERED"},
          ].map((m,i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-lg md:text-xl tracking-tight"
                style={{color:"#f0f0f0", textShadow:"0 0 20px rgba(79,142,247,0.2)"}}>
                {m.value}
              </span>
              <span className="text-[8px] tracking-[0.2em] text-[#333]">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{opacity:subVisible?1:0, transition:"opacity 0.5s ease 0.7s"}}>
        <span className="text-[8px] tracking-[0.45em] text-[#252525]">SCROLL</span>
        <div className="w-px h-7 bg-gradient-to-b from-[#4f8ef7] to-transparent"/>
      </div>
    </section>
  );
}
