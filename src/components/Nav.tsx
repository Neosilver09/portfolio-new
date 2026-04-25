"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#about",      label: "ABOUT"   },
  { href: "#experience", label: "EXP"     },
  { href: "#projects",   label: "PROJECTS"},
  { href: "#skills",     label: "SKILLS"  },
  { href: "#contact",    label: "CONTACT" },
];

/*
 * For parallax sections (tall sticky wrappers), clicking the nav should land
 * at the position where the main content is already fully revealed —
 * not at the raw wrapper top which is still the "scroll-through" zone.
 *
 * progress = what fraction into the sticky scroll should be visible.
 * 0.65 → DualCore split layout fully open
 * 0.45 → Experience card-1 fully visible
 */
const PARALLAX_PROGRESS: Record<string, number> = {
  about:      0.65,
  experience: 0.45,
};

/** Return the scrollY that puts a section's content in view */
function contentScrollY(id: string): number {
  const el = document.getElementById(id);
  if (!el) return 0;

  const prog = PARALLAX_PROGRESS[id];
  if (prog !== undefined && el.offsetHeight > window.innerHeight * 2) {
    // Tall sticky section — jump to content-ready offset
    const scrollable = el.offsetHeight - window.innerHeight;
    return el.offsetTop + prog * Math.max(0, scrollable);
  }

  return el.offsetTop - 20; // small clearance for other sections
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState("");
  const [visible,  setVisible]  = useState(false);
  const rafRef = useRef<number | null>(null);

  /* Fade-in after hero animation */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  /* Scrolled state (for nav background) */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * Active section — pure scroll-position approach.
   * Avoids IntersectionObserver DOM timing issues caused by useIsDesktop()
   * swapping the element after observer setup.
   *
   * Rule: the last section whose offsetTop is ≤ (scrollY + 40% viewport) is active.
   */
  useEffect(() => {
    const ids = LINKS.map(l => l.href.slice(1));

    const compute = () => {
      const fromTop = window.scrollY + window.innerHeight * 0.42;
      let found = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= fromTop) found = id;
      }
      setActive(found);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    compute(); // initial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Click handler — smooth-scroll to content position */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    window.scrollTo({ top: contentScrollY(id), behavior: "smooth" });
  };

  return (
    <nav
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-colors duration-300 ${
        scrolled ? "bg-[#050505]/90 backdrop-blur-md border-b border-[#1c1c1c]" : "bg-transparent"
      }`}
    >
      <a
        href="#"
        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        className="text-xs tracking-[0.3em] text-[#f0f0f0] hover:text-[#4f8ef7] transition-colors duration-200"
      >
        AS
      </a>

      <div className="hidden md:flex items-center gap-8">
        {LINKS.map(link => {
          const id = link.href.slice(1);
          const isActive = active === id;
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={e => handleClick(e, id)}
              className="relative text-[10px] tracking-[0.25em] transition-colors duration-200"
              style={{ color: isActive ? "#4f8ef7" : "#555" }}
            >
              {link.label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#4f8ef7]"
                      style={{ animation: "fade-in 0.2s ease forwards" }} />
              )}
            </a>
          );
        })}
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
