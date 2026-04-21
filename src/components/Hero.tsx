"use client";

import { useEffect, useState } from "react";
import { useScrollY, useSmoothMouse } from "@/hooks/useParallax";

/* ─── Constellation stars — pre-computed to avoid SSR mismatch ───── */
const STARS = [
  // [x%, y%, size, opacity, twinkle-delay]
  [8,  12, 1.5, 0.6, 0],    [18,  6, 1,   0.4, 0.8],
  [31, 19, 2,   0.7, 1.6],  [45,  8, 1,   0.35,0.4],
  [58, 14, 1.5, 0.5, 1.2],  [72,  9, 1,   0.4, 2.0],
  [84, 18, 2,   0.65,0.6],  [93,  7, 1,   0.3, 1.4],
  [6,  32, 1,   0.35,1.8],  [15, 45, 2.5, 0.8, 0.2],
  [25, 38, 1,   0.4, 1.0],  [38, 28, 1.5, 0.5, 2.2],
  [52, 35, 1,   0.3, 0.8],  [64, 42, 2,   0.6, 1.6],
  [77, 31, 1,   0.35,0.4],  [88, 39, 1.5, 0.5, 1.0],
  [96, 28, 1,   0.3, 2.4],  [4,  58, 2,   0.6, 1.2],
  [12, 70, 1,   0.35,0.6],  [22, 62, 1.5, 0.5, 2.0],
  [35, 75, 1,   0.3, 1.4],  [48, 65, 2,   0.65,0.2],
  [61, 72, 1.5, 0.45,1.8],  [73, 58, 1,   0.3, 0.8],
  [82, 67, 2,   0.6, 1.6],  [91, 75, 1,   0.35,0.4],
  [97, 62, 1.5, 0.4, 2.2],  [9,  84, 1,   0.3, 1.0],
  [20, 88, 2,   0.55,0.6],  [33, 82, 1,   0.35,2.0],
  [46, 90, 1.5, 0.4, 1.4],  [59, 86, 1,   0.3, 0.2],
  [71, 91, 2,   0.6, 1.8],  [85, 83, 1,   0.35,0.8],
  [42, 52, 3,   0.9, 0.4],  [68, 22, 2.5, 0.8, 1.2],  // bright anchors
  [24, 78, 2.5, 0.75,2.0],  [79, 54, 3,   0.85,0.6],
];

/* Constellation edges connecting nearby stars */
const EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],
  [8,9],[9,10],[10,11],[11,12],[12,13],[13,14],
  [15,34],[34,36],[36,35],[35,37],
  [17,18],[18,19],[19,20],[20,21],
  [22,23],[23,24],[24,25],[25,26],
  [27,28],[28,29],[29,30],[30,31],
  [2,9],[9,19],[19,28],[6,14],[14,24],[24,33],
];

/* ─── Floating data particles ──────────────────────────────────────── */
const PARTICLES = [
  { x: "10%", y: "20%", label: "v_∞ = 0.82M", depth: 0.06 },
  { x: "84%", y: "15%", label: "σ = 0.0031",  depth: 0.04 },
  { x: "7%",  y: "65%", label: "λ = 1.064μm", depth: 0.08 },
  { x: "88%", y: "70%", label: "Δt = 2.4ms",  depth: 0.05 },
  { x: "78%", y: "42%", label: "F1 = 0.94",   depth: 0.07 },
  { x: "16%", y: "46%", label: "ε = 0.0012",  depth: 0.03 },
];

/* ─── Per-letter reveal ─────────────────────────────────────────────── */
function AnimatedWord({ word, started, baseDelay }: {
  word: string; started: boolean; baseDelay: number;
}) {
  return (
    <div className="flex justify-center w-full">
      {word.split("").map((char, i) => (
        <span key={i} className="inline-block" style={{
          opacity:   started ? 1 : 0,
          transform: started ? "translateY(0)" : "translateY(28px)",
          filter:    started ? "blur(0px)" : "blur(8px)",
          transition:`opacity 0.55s cubic-bezier(.16,1,.3,1) ${baseDelay + i * 40}ms,
                      transform 0.55s cubic-bezier(.16,1,.3,1) ${baseDelay + i * 40}ms,
                      filter 0.45s ease ${baseDelay + i * 40}ms`,
        }}>{char}</span>
      ))}
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function Hero() {
  const [started,    setStarted]    = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const [glitch,     setGlitch]     = useState(false);
  const [particles,  setParticles]  = useState(false);

  const scrollY = useScrollY();
  const mouse   = useSmoothMouse(0.06);

  useEffect(() => {
    const t1 = setTimeout(() => setStarted(true),    300);
    const t2 = setTimeout(() => setSubVisible(true), 1350);
    const t3 = setTimeout(() => setGlitch(true),     1080);
    const t4 = setTimeout(() => setGlitch(false),    1230);
    const t5 = setTimeout(() => setParticles(true),  1800);
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, []);

  const bgY       = scrollY * 0.22;
  const radarY    = scrollY * 0.12;
  const nameScale = Math.max(0.92, 1 - scrollY * 0.00012);
  const vignetteO = Math.min(0.6, scrollY * 0.003);
  const tiltX     = mouse.y * -3;
  const tiltY     = mouse.x *  3;

  return (
    <section id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Constellation + SVG grid — parallax bg ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
        style={{ transform: `translateY(${bgY}px)`, willChange: "transform" }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4f8ef7" strokeWidth="0.4"/>
          </pattern>
          <pattern id="subgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4f8ef7" strokeWidth="0.15"/>
          </pattern>
          {/* Glow filter for bright stars */}
          <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="star-glow-sm" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Sub-grid + main grid */}
        <rect width="100%" height="100%" fill="url(#subgrid)" opacity="0.02"/>
        <rect width="100%" height="100%" fill="url(#grid)"    opacity="0.04"/>

        {/* Diagonal precision lines */}
        <line x1="0"    y1="0" x2="26%"  y2="36%" stroke="#4f8ef7" strokeWidth="0.4" opacity="0.04"/>
        <line x1="100%" y1="0" x2="74%"  y2="36%" stroke="#4f8ef7" strokeWidth="0.4" opacity="0.04"/>

        {/* Corner crosshair */}
        <g stroke="#4f8ef7" strokeWidth="0.8" opacity="0.2">
          <line x1="28" y1="26" x2="58" y2="26"/>
          <line x1="43" y1="11" x2="43" y2="41"/>
          <circle cx="43" cy="26" r="2" fill="none" opacity="0.5"/>
        </g>

        {/* Reticle circles */}
        <circle cx="50%" cy="50%" r="180" fill="none" stroke="#4f8ef7" strokeWidth="0.3" opacity="0.035"/>
        <circle cx="50%" cy="50%" r="280" fill="none" stroke="#4f8ef7" strokeWidth="0.3" opacity="0.02"/>

        {/* Tick marks */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
          const rad = deg * Math.PI / 180;
          const f = (n: number) => Math.round(n * 100) / 100;
          return (
            <line key={deg}
              x1={`calc(50% + ${f(Math.cos(rad)*276)}px)`}
              y1={`calc(50% + ${f(Math.sin(rad)*276)}px)`}
              x2={`calc(50% + ${f(Math.cos(rad)*284)}px)`}
              y2={`calc(50% + ${f(Math.sin(rad)*284)}px)`}
              stroke="#4f8ef7" strokeWidth="0.6" opacity="0.08"/>
          );
        })}

        {/* ── Constellation edges ── */}
        {EDGES.map(([a, b], i) => {
          const sa = STARS[a], sb = STARS[b];
          return (
            <line key={i}
              x1={`${sa[0]}%`} y1={`${sa[1]}%`}
              x2={`${sb[0]}%`} y2={`${sb[1]}%`}
              stroke="#4f8ef7" strokeWidth="0.4"
              opacity="0.07"
            />
          );
        })}

        {/* ── Stars ── */}
        {STARS.map(([x, y, size, opacity, delay], i) => {
          const isBright = size >= 2.5;
          return (
            <g key={i} filter={isBright ? "url(#star-glow)" : "url(#star-glow-sm)"}>
              <circle
                cx={`${x}%`} cy={`${y}%`}
                r={size as number}
                fill={isBright ? "#a8c8ff" : "#6fa8f5"}
                opacity={opacity as number}
                style={{
                  animation: `blink-dot ${2.5 + (delay as number) * 0.8}s ease-in-out ${delay as number * 0.4}s infinite`,
                }}
              />
              {/* Halo for bright stars */}
              {isBright && (
                <circle
                  cx={`${x}%`} cy={`${y}%`}
                  r={(size as number) * 2.5}
                  fill="none"
                  stroke="#4f8ef7"
                  strokeWidth="0.5"
                  opacity={(opacity as number) * 0.3}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* ── Radar rings — parallax layer 2 ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ transform: `translateY(${radarY}px)`, willChange: "transform" }}
      >
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
          opacity:0.1, animation:"scanline 6s linear infinite",
        }}/>
      </div>

      {/* ── Floating data particles — desktop only ── */}
      {PARTICLES.map((p, i) => (
        <div key={i}
          className="absolute pointer-events-none select-none hidden md:block"
          style={{
            left: p.x, top: p.y,
            opacity: particles ? 1 : 0,
            transform: `translateY(${particles ? scrollY * p.depth * -1 : -10}px) translateX(${mouse.x * p.depth * 30}px)`,
            transition: `opacity 0.6s ease ${i * 200}ms`,
            willChange: "transform",
          }}>
          <span style={{
            fontFamily:"ui-monospace,'SF Mono',Consolas,monospace",
            fontSize:"9px", letterSpacing:"0.15em",
            color:"#4f8ef7", opacity: 0.3,
          }}>{p.label}</span>
        </div>
      ))}

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:`radial-gradient(ellipse at center, transparent ${25 - vignetteO * 8}%, #050505 ${85 - vignetteO * 8}%)`,
      }}/>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-4xl">

        {/* Status chip */}
        <div className="flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-[#1c1c1c] text-[10px] tracking-[0.3em] text-[#555]"
          style={{ opacity:subVisible?1:0, transition:"opacity 0.5s ease"}}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7]"
            style={{animation:"blink-dot 2s ease-in-out infinite"}}/>
          AVAILABLE · AI ENGINEER ROLES
        </div>

        {/* ── Name — full-width block so both words center uniformly ── */}
        <div className="relative w-full mb-2">
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
                  right:"calc(100% + 14px)", top:"50%",
                  transform:"translateY(-50%) rotate(-90deg)",
                  fontSize:"7px", letterSpacing:"0.3em", color:"#4f8ef7", opacity:0,
                  animation:"fade-in 0.4s ease 900ms forwards", whiteSpace:"nowrap",
                }}>ID·001</span>
              <span className="absolute pointer-events-none hidden sm:block"
                style={{
                  left:"calc(100% + 14px)", top:"50%",
                  transform:"translateY(-50%) rotate(90deg)",
                  fontSize:"7px", letterSpacing:"0.3em", color:"#4f8ef7", opacity:0,
                  animation:"fade-in 0.4s ease 900ms forwards", whiteSpace:"nowrap",
                }}>2026</span>
            </>
          )}

          {/* Name — 3D tilt + scale on scroll */}
          <div style={{
            perspective:"700px",
            perspectiveOrigin:"50% 50%",
          }}>
            <h1
              className="leading-[0.9] tracking-[0.12em] select-none w-full"
              style={{
                fontSize:"clamp(2.6rem, 7.5vw, 5.2rem)",
                color: glitch ? "#4f8ef7" : "#f0f0f0",
                textShadow: glitch
                  ? "0 0 30px rgba(79,142,247,0.8), -2px 0 #00d4aa, 2px 0 #f7a24f"
                  : started ? "0 0 80px rgba(79,142,247,0.05)" : "none",
                filter: glitch ? "hue-rotate(25deg)" : "none",
                transform:`scale(${nameScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                transformStyle:"preserve-3d",
                transition:"color 0.05s, filter 0.05s, text-shadow 0.12s",
                willChange:"transform",
              }}
            >
              <AnimatedWord word="ANISHAN"    started={started} baseDelay={0}/>
              <AnimatedWord word="SEBANATHAN" started={started} baseDelay={160}/>
            </h1>
          </div>

          {/* Shimmer underline */}
          <div style={{
            height:"1px", marginTop:14,
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

        {/* Credential line */}
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
            className="group relative px-6 py-2.5 text-[10px] tracking-[0.3em] bg-[#4f8ef7] text-[#050505] font-bold rounded-sm overflow-hidden">
            <span className="relative z-10">VIEW PROJECTS</span>
            <span className="absolute inset-0 bg-[#7aaeff] opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
          </a>
          <a href="#contact"
            className="px-6 py-2.5 text-[10px] tracking-[0.3em] border border-[#222] text-[#555] rounded-sm hover:border-[#4f8ef7] hover:text-[#f0f0f0] transition-all duration-200">
            CONTACT
          </a>
        </div>

        {/* Metrics */}
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
        style={{
          opacity: subVisible ? Math.max(0, 1 - scrollY * 0.008) : 0,
          transition:"opacity 0.5s ease 0.7s",
        }}>
        <span className="text-[8px] tracking-[0.45em] text-[#252525]">SCROLL</span>
        <div className="w-px h-7 bg-gradient-to-b from-[#4f8ef7] to-transparent"/>
      </div>
    </section>
  );
}
