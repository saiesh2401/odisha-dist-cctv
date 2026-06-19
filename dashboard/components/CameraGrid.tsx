"use client";

import { cameras } from "@/lib/mock-data";
import { Camera, Maximize2, Video } from "lucide-react";
import { useState, useEffect } from "react";

// Different visual themes per camera to look varied
const feedStyles = [
  { gradient: "from-slate-800/90 via-gray-900/80 to-slate-800/90", scene: "road" },
  { gradient: "from-gray-900/90 via-slate-800/80 to-gray-900/90", scene: "junction" },
  { gradient: "from-zinc-900/90 via-slate-900/80 to-zinc-900/90", scene: "gate" },
  { gradient: "from-slate-900/90 via-gray-800/80 to-slate-900/90", scene: "market" },
  { gradient: "from-gray-800/90 via-zinc-900/80 to-gray-800/90", scene: "road" },
  { gradient: "from-zinc-800/90 via-gray-900/80 to-zinc-800/90", scene: "junction" },
  { gradient: "from-slate-800/90 via-zinc-900/80 to-slate-800/90", scene: "gate" },
  { gradient: "from-gray-900/90 via-zinc-800/80 to-gray-900/90", scene: "market" },
];

function CameraFeedSimulation({ scene, index }: { scene: string; index: number }) {
  // Create a more realistic-looking simulated scene
  return (
    <div className="absolute inset-0">
      {/* Base scene */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#151d2a] to-[#0a0f18]" />

      {/* Ambient light patches to simulate street lights */}
      <div
        className="absolute rounded-full blur-2xl opacity-20"
        style={{
          width: "40%",
          height: "50%",
          background: "radial-gradient(circle, rgba(255,200,100,0.3), transparent)",
          top: `${10 + (index % 3) * 15}%`,
          left: `${20 + (index % 4) * 15}%`,
        }}
      />

      {/* Road / ground simulation */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#1a1f2e]/80 to-transparent">
        {/* Road markings */}
        <div className="absolute bottom-[35%] left-[5%] right-[5%] h-[1px] bg-slate-600/20" />
        <div className="absolute bottom-[50%] left-[15%] right-[15%] h-[1px] bg-slate-600/15" />
        {/* Dashed center line */}
        <div className="absolute bottom-[42%] left-[30%] flex gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-3 h-[1px] bg-yellow-500/15" />
          ))}
        </div>
      </div>

      {/* Simulated objects/structures */}
      {scene === "junction" && (
        <>
          {/* Buildings silhouette */}
          <div className="absolute top-[15%] left-[5%] w-[15%] h-[40%] bg-slate-800/40 rounded-sm" />
          <div className="absolute top-[20%] right-[8%] w-[12%] h-[35%] bg-slate-800/30 rounded-sm" />
          {/* Windows */}
          <div className="absolute top-[20%] left-[7%] w-[2%] h-[2%] bg-amber-500/20 rounded-sm" />
          <div className="absolute top-[26%] left-[12%] w-[2%] h-[2%] bg-yellow-400/15 rounded-sm" />
        </>
      )}

      {scene === "gate" && (
        <>
          <div className="absolute top-[30%] left-[35%] w-[30%] h-[25%] border border-slate-700/20 rounded-sm" />
          <div className="absolute top-[25%] left-[48%] w-[4%] h-[5%] bg-slate-600/30 rounded-sm" />
        </>
      )}

      {scene === "market" && (
        <>
          <div className="absolute top-[25%] left-[10%] w-[25%] h-[30%] bg-slate-800/25 rounded-sm" />
          <div className="absolute top-[28%] left-[50%] w-[20%] h-[28%] bg-slate-800/20 rounded-sm" />
          {/* Shop lights */}
          <div className="absolute top-[30%] left-[12%] w-[8%] h-[1px] bg-amber-400/25" />
          <div className="absolute top-[30%] left-[52%] w-[6%] h-[1px] bg-cyan-400/15" />
        </>
      )}

      {/* Slight noise texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}

export default function CameraGrid() {
  const [currentTime, setCurrentTime] = useState("");
  const displayCameras = cameras.slice(0, 6);

  // Update timestamps every second (client only to avoid hydration mismatch)
  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-50">
            <Video className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 tracking-wide">Live Camera Feeds</h3>
          <span className="text-[9px] text-slate-400 font-medium ml-0.5 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
            76 cameras &bull; 73 online
          </span>
        </div>
        <button className="text-[10px] text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">
          View All &rarr;
        </button>
      </div>
      <div className="flex-1 p-2.5 grid grid-cols-3 gap-2.5 overflow-y-auto content-start">
        {displayCameras.map((cam, idx) => {
          const isOnline = cam.status === "online";
          const style = feedStyles[idx % feedStyles.length];

          return (
            <div key={cam.id} className="camera-feed group cursor-pointer">
              {/* Simulated feed */}
              <CameraFeedSimulation scene={style.scene} index={idx} />

              {/* AI Detection box — only on ANPR cams, compact */}
              {cam.type === "ANPR" && (
                <div className="absolute top-[18%] left-[15%] w-[45%] h-[28%] z-[12]">
                  <div className="w-full h-full border border-cyan-400/60 rounded-sm">
                    <span className="absolute -top-3.5 left-0 text-[6px] font-mono font-bold bg-cyan-600 text-white px-1 py-px rounded">
                      OD-21-B-3456
                    </span>
                  </div>
                </div>
              )}

              {/* Scan line */}
              {isOnline && <div className="scan-line" />}

              {/* Gradient overlay */}
              <div className="camera-overlay" />

              {/* Camera info bar */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 z-10">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOnline ? "bg-emerald-400" : "bg-red-400"}`} />
                  <span className="text-[8px] font-bold text-white/90">{cam.id}</span>
                </div>
                <p className="text-[8px] text-white/50 truncate mt-0.5">{cam.name}</p>
              </div>

              {/* REC + Time */}
              {isOnline && (
                <div className="absolute top-1 right-1 z-10 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 animate-blink" />
                  <span className="text-[6px] font-bold text-red-400">REC</span>
                </div>
              )}
              <div className="absolute top-1 left-1 z-10">
                <span className="text-[6px] font-mono text-white/30">{currentTime}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
