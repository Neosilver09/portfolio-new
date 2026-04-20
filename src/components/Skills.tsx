"use client";

import { useInView } from "@/hooks/useInView";

const skillGroups = [
  { domain:"MACHINE LEARNING",   color:"#4f8ef7", skills:["Python","Scikit-learn","TensorFlow","Predictive Modeling","Supervised Learning","Data Analysis","Feature Engineering","Pandas / NumPy"] },
  { domain:"PERCEPTION & ROBOTICS", color:"#00d4aa", skills:["ROS2","ORB-SLAM3","Extended Kalman Filter","Sensor Fusion","LiDAR / Camera","OpenCV","Gazebo Simulation","ArduPilot"] },
  { domain:"SOFTWARE ENGINEERING", color:"#f7a24f", skills:["C / C++","Java","MATLAB","ADA","Git","Linux","Streamlit","System Integration"] },
  { domain:"AI SYSTEMS (EXPLORING)", color:"#888", skills:["Generative AI","LLM-based Systems","MPC Control","Stochastic Modeling","Big Data Pipelines","SQL"] },
];

const languages = [
  { lang:"FRENCH",   level:"NATIVE", pct:100 },
  { lang:"ENGLISH",  level:"C1",     pct:88  },
  { lang:"TAMIL",    level:"NATIVE", pct:100 },
  { lang:"GERMAN",   level:"B1",     pct:55  },
  { lang:"JAPANESE", level:"A2/B1",  pct:38  },
];

/* ── Skill group card — each has its own IntersectionObserver ── */
function SkillCard({ group, delay }: { group: typeof skillGroups[0]; delay: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className="border border-[#1c1c1c] rounded-sm p-6 hover:border-[#2a2a2a] transition-colors duration-300"
      style={{
        background:"#080808",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(16px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="text-[9px] tracking-[0.35em] mb-4" style={{ color:group.color }}>{group.domain}</div>
      <div className="flex flex-wrap gap-2">
        {group.skills.map(skill => (
          <span key={skill} className="px-2.5 py-1 text-xs text-[#888] border border-[#1c1c1c] rounded-sm hover:text-[#f0f0f0] hover:border-[#333] transition-all duration-200 cursor-default">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const { ref: langRef,  inView: langInView  } = useInView();

  return (
    <section id="skills" className="py-32 px-6 max-w-5xl mx-auto">
      <div ref={titleRef}>
        <div className="text-[10px] tracking-[0.4em] text-[#444] mb-4 text-center" style={{ opacity:titleInView?1:0, transition:"opacity 0.6s" }}>— TECHNICAL ARSENAL —</div>
        <h2 className="text-2xl md:text-3xl tracking-[0.08em] text-center text-[#f0f0f0] mb-16"
          style={{ opacity:titleInView?1:0, transform:titleInView?"none":"translateY(10px)", transition:"opacity 0.6s ease 100ms, transform 0.6s ease 100ms" }}>
          TOOLS & <span className="text-[#4f8ef7]">TECHNOLOGIES</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {skillGroups.map((group, i) => <SkillCard key={group.domain} group={group} delay={i * 80} />)}
      </div>

      <div ref={langRef} className="border-t border-[#1c1c1c] pt-14">
        <div className="text-[10px] tracking-[0.4em] text-[#444] mb-8 text-center" style={{ opacity:langInView?1:0, transition:"opacity 0.6s" }}>— LANGUAGES —</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {languages.map((l, i) => (
            <div key={l.lang} className="flex flex-col gap-2"
              style={{ opacity:langInView?1:0, transform:langInView?"none":"translateY(10px)", transition:`opacity 0.6s ease ${i*80}ms, transform 0.6s ease ${i*80}ms` }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] text-[#f0f0f0]">{l.lang}</span>
                <span className="text-[8px] text-[#555]">{l.level}</span>
              </div>
              <div className="h-px bg-[#1c1c1c] relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#4f8ef7]"
                  style={{ width: langInView ? `${l.pct}%` : "0%", transition:`width 0.8s ease ${i*0.1+0.3}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
