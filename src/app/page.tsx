import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CursorGlow from "@/components/CursorGlow";
import ScrollLine from "@/components/ScrollLine";
import DualCore from "@/components/DualCore";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative bg-[#050505] text-[#f0f0f0]" style={{ fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace" }}>
      <CursorGlow />
      <ScrollLine />
      <Nav />
      <Hero />
      <DualCore />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <footer className="border-t border-[#1c1c1c] py-8 text-center text-[#444] text-xs tracking-widest">
        © 2026 ANISHAN SEBANATHAN · BUILT WITH PRECISION
      </footer>
    </main>
  );
}
