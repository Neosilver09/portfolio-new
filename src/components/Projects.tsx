"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const projects = [
  {
    id:"orb-slam", title:"GPS-DENIED NAVIGATION SYSTEM", subtitle:"ASDL Grand Challenge · ONR-Funded · Georgia Tech",
    tags:["ORB-SLAM3","ROS2","PERCEPTION PIPELINE","MPC CONTROL"], color:"#4f8ef7", accent:"PERCEPTION / SLAM",
    summary:"Real-time visual perception and localization pipeline for a marine autonomous vehicle operating in GPS-denied environments.",
    detail:[
      "Implemented ORB-SLAM3 within a modular ROS2 architecture enabling real-time feature extraction, tracking, and map construction",
      "Built a multi-modal sensor fusion layer combining LiDAR point clouds and camera data for robust state estimation",
      "Integrated ArduPilot with a Model Predictive Control (MPC) layer for trajectory following under physical constraints",
      "Developed a full Gazebo simulation environment for sensor characterization and navigation stress-testing",
    ],
    stack:"Python · C++ · ROS2 · Gazebo · OpenCV · ArduPilot",
  },
  {
    id:"ekf", title:"AUTONOMOUS LOCALIZATION — EKF PIPELINE", subtitle:"Bubblerob · ROS2 · Georgia Tech",
    tags:["EKF","SENSOR FUSION","SLAM","STATE ESTIMATION"], color:"#00d4aa", accent:"STATE ESTIMATION",
    summary:"Extended Kalman Filter for real-time probabilistic state estimation and SLAM in a mobile robot system.",
    detail:[
      "Implemented a full EKF pipeline fusing odometry, IMU, and LiDAR measurements into a consistent robot pose estimate",
      "Developed a Scan Matching-based SLAM frontend for incremental map building with loop closure detection",
      "Designed sensor fusion architecture handling asynchronous inputs at different frequencies with uncertainty propagation",
      "Built autonomous navigation behaviors (obstacle avoidance, goal pursuit) on top of the localization stack",
    ],
    stack:"Python · ROS2 · NumPy · LiDAR · IMU",
  },
  {
    id:"afr-ml", title:"LARGE-SCALE COST PREDICTION SYSTEM", subtitle:"Air France Industries · Production · 2026",
    tags:["PREDICTIVE ML","DATA PIPELINE","STREAMLIT","€87M SCALE"], color:"#f7a24f", accent:"ML / DATA SYSTEMS",
    summary:"End-to-end ML system for transportation cost prediction across aviation logistics at enterprise data scale.",
    detail:[
      "Designed and trained supervised ML models (gradient boosting + regression ensembles) for multi-dimensional cost forecasting",
      "Built ETL pipelines to ingest, clean, and transform operational data from heterogeneous logistics sources",
      "Architected a feature engineering layer capturing temporal, route-level, and fleet-type signals",
      "Deployed an interactive Streamlit dashboard enabling finance and ops teams to explore predictions and run scenarios",
    ],
    stack:"Python · Scikit-learn · Pandas · Streamlit · SQL",
  },
];

function ProjectCard({ project, delay }: { project: typeof projects[0]; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className="border border-[#1c1c1c] rounded-sm overflow-hidden hover:border-[#2a2a2a] transition-colors duration-300"
      style={{
        background:"#080808",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="p-6 cursor-pointer select-none" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-[9px] tracking-[0.35em] mb-2" style={{ color:project.color }}>{project.accent}</div>
            <h3 className="text-base md:text-lg tracking-[0.05em] text-[#f0f0f0] mb-1">{project.title}</h3>
            <div className="text-[10px] tracking-[0.15em] text-[#444] mb-3">{project.subtitle}</div>
            <p className="text-sm text-[#666] leading-relaxed">{project.summary}</p>
          </div>
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full border border-[#1c1c1c] flex items-center justify-center text-[#444] hover:border-[#4f8ef7] hover:text-[#4f8ef7] transition-all duration-200 mt-1"
            style={{ transform: expanded ? "rotate(45deg)" : "none", transition:"transform 0.25s ease" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[8px] tracking-[0.2em] border rounded-sm"
              style={{ borderColor:`${project.color}30`, color:`${project.color}aa` }}>{tag}</span>
          ))}
        </div>
      </div>
      <div style={{ maxHeight: expanded ? "600px" : "0", overflow:"hidden", transition:"max-height 0.35s ease" }}>
        <div className="px-6 pb-6 border-t border-[#1c1c1c]">
          <div className="pt-5 space-y-2 mb-5">
            {project.detail.map((line, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-[#666] leading-relaxed">
                <span style={{ color:project.color }} className="flex-shrink-0 mt-0.5">›</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-[#1c1c1c] pt-4">
            <span className="text-[9px] tracking-[0.3em] text-[#333]">STACK</span>
            <span className="text-[9px] text-[#555]">{project.stack}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { ref, inView } = useInView();
  return (
    <section id="projects" className="py-32 px-6 max-w-5xl mx-auto">
      <div ref={ref}>
        <div className="text-[10px] tracking-[0.4em] text-[#444] mb-4 text-center" style={{ opacity:inView?1:0, transition:"opacity 0.6s" }}>— SELECTED PROJECTS —</div>
        <h2 className="text-2xl md:text-3xl tracking-[0.08em] text-center text-[#f0f0f0] mb-4" style={{ opacity:inView?1:0, transform:inView?"none":"translateY(10px)", transition:"opacity 0.6s ease 100ms, transform 0.6s ease 100ms" }}>
          SYSTEMS BUILT, <span className="text-[#4f8ef7]">PROBLEMS SOLVED</span>
        </h2>
        <p className="text-xs text-[#555] text-center mb-16 max-w-xl mx-auto" style={{ opacity:inView?1:0, transition:"opacity 0.6s ease 150ms" }}>
          Click any project to expand technical depth.
        </p>
      </div>
      <div className="space-y-4">
        {projects.map((p, i) => <ProjectCard key={p.id} project={p} delay={i * 80} />)}
      </div>
    </section>
  );
}
