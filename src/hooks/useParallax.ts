"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Global scroll Y (shared RAF, single listener) ─────────────────── */
let scrollListeners: Set<(y: number) => void> = new Set();
let rafId: number | null = null;
let lastY = 0;

function scheduleFlush() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const y = window.scrollY;
    if (y !== lastY) {
      lastY = y;
      scrollListeners.forEach(fn => fn(y));
    }
  });
}

export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    setY(window.scrollY);
    scrollListeners.add(setY);
    window.addEventListener("scroll", scheduleFlush, { passive: true });
    return () => {
      scrollListeners.delete(setY);
      if (scrollListeners.size === 0)
        window.removeEventListener("scroll", scheduleFlush);
    };
  }, []);
  return y;
}

/* ── Smooth lerp mouse position ─────────────────────────────────────── */
export function useSmoothMouse(factor = 0.08) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,  // -1..1
        y: (e.clientY / window.innerHeight) * 2 - 1,  // -1..1
      };
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * factor;
      current.current.y += (target.current.y - current.current.y) * factor;
      setPos({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [factor]);

  return pos;
}

/* ── Scroll progress through a tall section wrapper ────────────────── */
export function useSectionScroll() {
  const ref  = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect      = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) { setProgress(0); return; }
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    const tick = () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(update); };
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", update);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return { ref, progress };
}

/* Interpolate a sub-phase from a global progress value */
export const ph = (p: number, s: number, e: number) => Math.max(0, Math.min(1, (p - s) / (e - s)));

/* Detect desktop (lg breakpoint, client-only) */
export function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const check = () => setDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return desktop;
}

/* ── Element-local mouse tilt (for cards) ───────────────────────────── */
export function useCardTilt(maxDeg = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 });

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - 0.5; // -0.5..0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({
      x:  ny * maxDeg * -1,   // rotateX
      y:  nx * maxDeg,         // rotateY
      gx: (nx + 0.5) * 100,   // gradient X%
      gy: (ny + 0.5) * 100,   // gradient Y%
    });
  }, [maxDeg]);

  const onLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, gx: 50, gy: 50 });
  }, []);

  return { ref, tilt, onMove, onLeave };
}
