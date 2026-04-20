"use client";

import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";

/* Orbit radius — smaller on mobile */
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

const nodes = [
  { label: "GEORGIA TECH", sub: "M.S. AEROSPACE ENG.", desc: "Autonomous Robotics · GPS-Denied Navigation · Systems Engineering · GPA 4.0", color: "#4f8ef7", angle: -90 },
  { label: "INP-ENSEEIHT", sub: "M.S. COMPUTER SCIENCE", desc: "Machine Learning · Big Data · Algorithm Design · Large-Scale Systems", color: "#00d4aa", angle: 90 },
];

const anim = (visible: boolean, delay = 0, dir: "up"|"right"|"scale" = "up") => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "none" : dir === "right" ? "translateX(20px)" : dir === "scale" ? "scale(0.92)" : "translateY(20px)",
  transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
});

export default function DualCore() {
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const { ref, inView } = useInView();
  const R = useOrbitR();
  const SIZE = R * 2 + 80; // container = orbit diameter + 80px breathing room

  return (
    <section id="about" className="relative py-40 px-6 max-w-6xl mx-auto overflow-hidden">
      <div ref={ref}>
        <div className="text-[10px] tracking-[0.4em] text-[#444] mb-16 text-center" style={anim(inView)}>
          — DUAL ACADEMIC CORE —
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Orbit */}
          <div className="flex justify-center" style={anim(inView, 100, "scale")}>
            <div
              className="relative"
              style={{ width: SIZE, height: SIZE }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => { setPaused(false); setHovered(null); }}
            >
              <div className="absolute rounded-full border border-[#1c1c1c]" style={{ width: R*2, height: R*2, left:`calc(50% - ${R}px)`, top:`calc(50% - ${R}px)` }} />
              <div className="absolute rounded-full border border-[#111]"    style={{ width: R*2+30, height: R*2+30, left:`calc(50% - ${R+15}px)`, top:`calc(50% - ${R+15}px)` }} />

              {nodes.map((node, i) => {
                const rad = (node.angle * Math.PI) / 180;
                return (
                  <div key={i} className="absolute inset-0" style={{ animation:`${i===0?"orbit-cw":"orbit-ccw"} 18s linear infinite`, animationPlayState: paused?"paused":"running" }}>
                    <div className="absolute" style={{ left:`calc(50% + ${Math.cos(rad)*R}px)`, top:`calc(50% + ${Math.sin(rad)*R}px)`, transform:"translate(-50%,-50%)" }}>
                      <div
                        style={{ animation:`${i===0?"orbit-ccw":"orbit-cw"} 18s linear infinite`, animationPlayState: paused?"paused":"running" }}
                        className="flex flex-col items-center cursor-pointer"
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div className="w-3 h-3 rounded-full transition-transform duration-300" style={{ background:node.color, boxShadow:`0 0 ${hovered===i?20:8}px ${node.color}80`, transform:hovered===i?"scale(1.5)":"scale(1)" }} />
                        <span className="text-[8px] tracking-[0.2em] font-bold mt-1.5 whitespace-nowrap" style={{ color:node.color }}>{node.label}</span>
                        <span className="text-[7px] text-[#555] whitespace-nowrap mt-0.5">{node.sub}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full border border-[#4f8ef7]/30 flex items-center justify-center mb-2" style={{ boxShadow:"0 0 30px #4f8ef720" }}>
                  <div className="w-2 h-2 rounded-full bg-[#4f8ef7]" />
                </div>
                <span className="text-[8px] tracking-[0.3em] text-[#555]">AI CORE</span>
              </div>

              {hovered !== null && (
                <div className="absolute -bottom-16 left-0 right-0 text-center" style={{ animation:"fade-in 0.2s ease forwards" }}>
                  <p className="text-[9px] text-[#666] leading-relaxed px-4">{nodes[hovered].desc}</p>
                </div>
              )}
            </div>
          </div>

          {/* Text */}
          <div className="space-y-8" style={anim(inView, 200, "right")}>
            <div>
              <h2 className="text-2xl md:text-3xl tracking-[0.1em] text-[#f0f0f0] mb-4">THE DUAL-CORE <span className="text-[#4f8ef7]">ADVANTAGE</span></h2>
              <p className="text-sm text-[#666] leading-relaxed">Where most engineers operate in one domain, I operate at the intersection of two. A Computer Science foundation from ENSEEIHT — algorithms, data systems, ML at scale. An Aerospace Engineering layer from Georgia Tech — autonomous systems, real-time perception, and physics-constrained AI.</p>
            </div>
            <div className="space-y-4">
              {[
                { label:"MACHINE LEARNING",   detail:"Predictive modeling · Large-scale data · End-to-end pipelines", color:"#4f8ef7" },
                { label:"PERCEPTION SYSTEMS", detail:"Real-time sensor fusion · SLAM · State estimation (EKF)",      color:"#00d4aa" },
                { label:"SYSTEMS THINKING",   detail:"ATA22/27 validation · Embedded constraints · Hardware-aware AI", color:"#888" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-px h-10 mt-1 flex-shrink-0" style={{ background:item.color }} />
                  <div>
                    <div className="text-[10px] tracking-[0.3em] mb-0.5" style={{ color:item.color }}>{item.label}</div>
                    <div className="text-xs text-[#555]">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[#1c1c1c]">
              <div className="flex gap-8">
                {[{v:"4.0",l:"GPA / 4.0"},{v:"5+",l:"LANGUAGES"},{v:"2×",l:"M.S. DEGREES"}].map((s,i) => (
                  <div key={i}><div className="text-xl text-[#f0f0f0] mb-0.5">{s.v}</div><div className="text-[9px] tracking-[0.2em] text-[#444]">{s.l}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
