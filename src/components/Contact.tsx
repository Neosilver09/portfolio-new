"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const links = [
  { label:"EMAIL",    value:"anishan.sebanathan@gmail.com",          href:"mailto:anishan.sebanathan@gmail.com",            copy:true  },
  { label:"GITHUB",   value:"github.com/Neosilver09",           href:"https://github.com/Neosilver09",            copy:false },
  { label:"LINKEDIN", value:"linkedin.com/in/anishan-sebanathan/", href:"https://www.linkedin.com/in/anishan-sebanathan/", copy:false },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const { ref, inView } = useInView();

  const copy = (v: string) => { navigator.clipboard.writeText(v); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section id="contact" className="py-40 px-6 max-w-5xl mx-auto">
      <div ref={ref}>
        <div className="text-[10px] tracking-[0.4em] text-[#444] mb-4 text-center" style={{ opacity:inView?1:0, transition:"opacity 0.6s" }}>— GET IN TOUCH —</div>
        <h2 className="text-3xl md:text-5xl tracking-[0.08em] text-center text-[#f0f0f0] mb-4"
          style={{ opacity:inView?1:0, transform:inView?"none":"translateY(10px)", transition:"opacity 0.6s ease 100ms, transform 0.6s ease 100ms" }}>
          LET'S <span className="text-[#4f8ef7]">BUILD</span>
        </h2>
        <p className="text-sm text-[#555] text-center mb-16 max-w-lg mx-auto leading-relaxed"
          style={{ opacity:inView?1:0, transition:"opacity 0.6s ease 150ms" }}>
          Open to AI Engineer, ML Engineer, and Research Engineer roles at forward-thinking teams. Available from late 2026.
        </p>

        <div className="flex flex-col items-center gap-4 mb-20">
          {links.map((link, i) => (
            <div key={link.label}
              className="w-full max-w-md flex items-center justify-between border border-[#1c1c1c] rounded-sm px-6 py-4 hover:border-[#2a2a2a] transition-colors duration-200 group"
              style={{ background:"#080808", opacity:inView?1:0, transform:inView?"none":"translateY(10px)", transition:`opacity 0.6s ease ${200+i*80}ms, transform 0.6s ease ${200+i*80}ms` }}
            >
              <div>
                <div className="text-[8px] tracking-[0.35em] text-[#444] mb-0.5">{link.label}</div>
                <div className="text-sm text-[#888] group-hover:text-[#f0f0f0] transition-colors duration-200">{link.value}</div>
              </div>
              <div className="flex items-center gap-3">
                {link.copy && (
                  <button onClick={() => copy(link.value)} className="text-[9px] tracking-[0.2em] text-[#444] hover:text-[#4f8ef7] transition-colors duration-200">
                    {copied ? "COPIED ✓" : "COPY"}
                  </button>
                )}
                <a href={link.href} target={link.copy ? undefined : "_blank"} rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full border border-[#1c1c1c] flex items-center justify-center text-[#444] hover:border-[#4f8ef7] hover:text-[#4f8ef7] transition-all duration-200"
                  aria-label={`Open ${link.label}`}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-[9px] tracking-[0.3em] text-[#333]"
          style={{ opacity:inView?1:0, transition:"opacity 0.6s ease 450ms" }}>
          <span>BASED IN ATLANTA, GA / TOULOUSE, FR</span>
          <span className="text-[#1c1c1c]">·</span>
          <span>GEORGIA TECH · INP-ENSEEIHT</span>
          <span className="text-[#1c1c1c]">·</span>
          <span className="text-[#4f8ef7]">OPEN TO RELOCATION</span>
        </div>
      </div>
    </section>
  );
}
