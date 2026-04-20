"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

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
  value: number; prefix?: string; suffix?: string; label: string; color?: string; delay?: number; active: boolean;
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
      <div className={`text-2xl tracking-tight ${done ? "glitch-end" : ""}`} style={{ color }}>{prefix}{fmt}{suffix}</div>
      <div className="text-[9px] tracking-[0.2em] text-[#444]">{label}</div>
    </div>
  );
}

function ExperienceCard({ company, role, period, bullets, tag, metrics, delay = 0 }: {
  company: string; role: string; period: string; bullets: string[]; tag: string; delay?: number;
  metrics?: { value: number; prefix?: string; suffix?: string; label: string; color?: string }[];
}) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className="relative border border-[#1c1c1c] rounded-sm p-8 group hover:border-[#2a2a2a] transition-colors duration-300"
      style={{
        background: "linear-gradient(135deg,#0a0a0a 0%,#050505 100%)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4f8ef7] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-[#4f8ef7] mb-1">{tag}</div>
          <h3 className="text-xl tracking-[0.05em] text-[#f0f0f0] mb-1">{company}</h3>
          <div className="text-sm text-[#666]">{role}</div>
        </div>
        <div className="text-[10px] tracking-[0.2em] text-[#444] whitespace-nowrap">{period}</div>
      </div>
      <ul className="space-y-2 mb-6">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-[#666] leading-relaxed">
            <span className="text-[#333] mt-0.5 flex-shrink-0">—</span><span>{b}</span>
          </li>
        ))}
      </ul>
      {metrics && (
        <div className="border-t border-[#1c1c1c] pt-6 grid grid-cols-2 gap-6">
          {metrics.map((m, i) => (
            <MetricWidget key={i} value={m.value} prefix={m.prefix} suffix={m.suffix} label={m.label} color={m.color} delay={i*200} active={inView} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Experience() {
  const { ref, inView } = useInView();

  return (
    <section id="experience" className="py-32 px-6 max-w-5xl mx-auto">
      <div ref={ref}>
        <div className="text-[10px] tracking-[0.4em] text-[#444] mb-4 text-center" style={{ opacity:inView?1:0, transition:"opacity 0.6s" }}>— PROFESSIONAL EXPERIENCE —</div>
        <h2 className="text-2xl md:text-3xl tracking-[0.08em] text-center text-[#f0f0f0] mb-16" style={{ opacity:inView?1:0, transform:inView?"none":"translateY(10px)", transition:"opacity 0.6s ease 100ms, transform 0.6s ease 100ms" }}>
          WHERE DATA MEETS <span className="text-[#4f8ef7]">IMPACT</span>
        </h2>
      </div>
      <div className="space-y-6">
        <ExperienceCard
          company="AIR FRANCE INDUSTRIES" role="Data Scientist & ML Engineer" period="MAY 2026 — DEC 2026" tag="INDUSTRY · MACHINE LEARNING"
          bullets={[
            "Developed ML models for large-scale transportation cost prediction across logistics operations",
            "Designed end-to-end data pipelines processing operational data at enterprise scale",
            "Built interactive Streamlit dashboard for real-time data visualization and decision support",
            "Applied data-driven optimization to reduce operational costs during initial deployment",
          ]}
          metrics={[
            { value:87,  suffix:"M€", label:"OPERATIONAL DATA PROCESSED", color:"#4f8ef7" },
            { value:100, prefix:"€", suffix:"K", label:"COST SAVINGS ACHIEVED", color:"#00d4aa" },
          ]}
        />
        <ExperienceCard
          company="AIRBUS" role="Flight Systems Validation Intern" period="JUN 2024 — AUG 2024" tag="AEROSPACE · AUTOMATION" delay={100}
          bullets={[
            "Automated compliance analysis for Airbus ATA22 (auto-flight) and ATA27 (flight controls) systems",
            "Developed Python tools for systematic test processing and traceability across validation workflows",
            "Improved reporting workflows by rationalizing data extraction and decision documentation processes",
          ]}
        />
      </div>
    </section>
  );
}
