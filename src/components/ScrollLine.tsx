"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SECTIONS = [
  { id: "hero",       label: "INTRO",      short: "00" },
  { id: "about",      label: "PROFILE",    short: "01" },
  { id: "experience", label: "EXPERIENCE", short: "02" },
  { id: "projects",   label: "PROJECTS",   short: "03" },
  { id: "skills",     label: "SKILLS",     short: "04" },
  { id: "contact",    label: "CONTACT",    short: "05" },
];

/* The line occupies LINE_H px of the viewport, centered vertically */
const LINE_H = 420;

export default function ScrollLine() {
  const [progress,    setProgress]    = useState(0);   // 0→1 scroll progress
  const [active,      setActive]      = useState(0);   // active section index
  const [ticks,       setTicks]       = useState<number[]>([]); // 0→1 per section
  const [hovered,     setHovered]     = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const rafRef = useRef<number>();

  /* Compute section tick positions as fraction 0→1 of total doc height */
  const computeTicks = useCallback(() => {
    const docH = document.body.scrollHeight;
    return SECTIONS.map(s => {
      const el = document.getElementById(s.id);
      return el ? el.offsetTop / docH : 0;
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    setTicks(computeTicks());

    let lastP = 0;
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.body.scrollHeight - window.innerHeight;
      const p = docH > 0 ? Math.min(scrollTop / docH, 1) : 0;

      if (Math.abs(p - lastP) > 0.0005) {
        lastP = p;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setProgress(p);

          /* Active section: last section whose top is above 40% viewport */
          const fromTop = scrollTop + window.innerHeight * 0.4;
          let a = 0;
          SECTIONS.forEach((s, i) => {
            const el = document.getElementById(s.id);
            if (el && el.offsetTop <= fromTop) a = i;
          });
          setActive(a);
        });
      }
    };

    const onResize = () => setTicks(computeTicks());

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [computeTicks]);

  if (!mounted) return null;

  /* Dot Y position within the line (px from line top) */
  const dotY = progress * LINE_H;

  return (
    <div
      className="fixed left-7 top-0 bottom-0 z-40 pointer-events-none hidden lg:flex items-center"
      aria-hidden
    >
      <div
        className="relative flex flex-col items-center cursor-pointer pointer-events-auto"
        style={{ height: LINE_H, width: 20 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Track (background) ── */}
        <div
          className="absolute left-[9px] top-0 bottom-0"
          style={{
            width: hovered ? 2 : 1,
            background: "#161616",
            transition: "width 0.3s ease",
          }}
        />

        {/* ── Filled portion (gradient travels down) ── */}
        <div
          className="absolute left-[9px] top-0"
          style={{
            width: hovered ? 2 : 1,
            height: dotY,
            background: "linear-gradient(180deg, #4f8ef7 0%, #00d4aa 100%)",
            boxShadow: hovered ? "0 0 6px rgba(79,142,247,0.5)" : "none",
            transition: "width 0.3s ease, box-shadow 0.3s ease",
          }}
        />

        {/* ── Glowing dot cursor ── */}
        <div
          className="absolute left-[9px]"
          style={{
            top: dotY,
            transform: "translate(-50%, -50%)",
            width: hovered ? 8 : 5,
            height: hovered ? 8 : 5,
            borderRadius: "50%",
            background: progress > 0.98 ? "#00d4aa" : "#4f8ef7",
            boxShadow: hovered
              ? "0 0 0 3px rgba(79,142,247,0.15), 0 0 10px rgba(79,142,247,0.6)"
              : "0 0 6px rgba(79,142,247,0.4)",
            transition: "width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease, background 0.4s ease",
          }}
        />

        {/* ── Section tick marks + labels ── */}
        {ticks.map((t, i) => {
          const y = t * LINE_H;                        // px from line top
          const isPast   = progress >= t;
          const isActive = active === i;
          return (
            <div key={i} className="absolute" style={{ top: y, left: 0, width: 20 }}>
              {/* tick */}
              <div
                style={{
                  position: "absolute",
                  left: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: isActive ? 8 : 5,
                  height: isActive ? 2 : 1,
                  background: isActive ? "#4f8ef7"
                            : isPast   ? "#00d4aa44"
                            : "#1e1e1e",
                  transition: "width 0.3s ease, background 0.4s ease",
                }}
              />

              {/* Label — appears on hover or when active */}
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: (hovered || isActive) ? 1 : 0,
                  transform: `translateY(-50%) translateX(${(hovered || isActive) ? 0 : -4}px)`,
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{
                  fontSize: 7,
                  letterSpacing: "0.25em",
                  color: isActive ? "#4f8ef7" : "#333",
                  transition: "color 0.3s ease",
                  fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace",
                }}>
                  {SECTIONS[i].short}
                </span>
                <span style={{
                  fontSize: 7,
                  letterSpacing: "0.2em",
                  color: isActive ? "#f0f0f0" : "#2a2a2a",
                  transition: "color 0.3s ease",
                  fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace",
                }}>
                  {SECTIONS[i].label}
                </span>
              </div>
            </div>
          );
        })}

        {/* ── Scroll % readout at bottom (shown on hover) ── */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 7,
            letterSpacing: "0.25em",
            color: "#333",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s ease",
            fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace",
            whiteSpace: "nowrap",
          }}
        >
          {Math.round(progress * 100).toString().padStart(3, "0")}%
        </div>
      </div>
    </div>
  );
}
