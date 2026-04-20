"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about",      label: "ABOUT" },
  { href: "#experience", label: "EXP" },
  { href: "#projects",   label: "PROJECTS" },
  { href: "#skills",     label: "SKILLS" },
  { href: "#contact",    label: "CONTACT" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("");
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map(l => l.href.slice(1));
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-colors duration-300 ${
        scrolled ? "bg-[#050505]/90 backdrop-blur-md border-b border-[#1c1c1c]" : "bg-transparent"
      }`}
    >
      <a href="#" className="text-xs tracking-[0.3em] text-[#f0f0f0] hover:text-[#4f8ef7] transition-colors duration-200">
        AS
      </a>
      <div className="hidden md:flex items-center gap-8">
        {links.map(link => (
          <a
            key={link.href}
            href={link.href}
            className="relative text-[10px] tracking-[0.25em] transition-colors duration-200"
            style={{ color: active === link.href.slice(1) ? "#4f8ef7" : "#666" }}
          >
            {link.label}
            {active === link.href.slice(1) && (
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#4f8ef7]" />
            )}
          </a>
        ))}
      </div>
      <a
        href="mailto:asebanathan3@gatech.edu"
        className="text-[10px] tracking-[0.2em] text-[#444] hover:text-[#4f8ef7] transition-colors duration-200 hidden md:block"
      >
        OPEN TO WORK
      </a>
    </nav>
  );
}
