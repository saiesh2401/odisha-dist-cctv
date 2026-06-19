"use client";

import { Shield, Radio, Bell, Clock, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  const [alertCount, setAlertCount] = useState(8);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertCount((c) => c + Math.floor(Math.random() * 2));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-50">
      <div className="bg-gradient-to-r from-[#1e3a5f] via-[#1a365d] to-[#1e3a5f] border-b border-[#2d4a6f]">
        <div className="flex items-center justify-between px-5 py-2.5">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1a365d]" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                AI Surveillance Command Center
              </h1>
              <p className="text-[10px] text-blue-200/60 font-semibold tracking-widest uppercase">
                Kandhamal District Police &bull; Phulbani, Odisha
              </p>
            </div>

            <div className="h-6 w-px bg-white/15 mx-1" />

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/25">
              <div className="relative">
                <Radio className="w-3 h-3 text-emerald-400" />
                <div className="absolute inset-0 animate-ping">
                  <Radio className="w-3 h-3 text-emerald-400 opacity-40" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider">LIVE</span>
            </div>
          </div>

          {/* Right: Time + Notifications + Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/8 border border-white/10">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-blue-100/70 font-medium">73/76 Online</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/8 border border-white/10">
              <Clock className="w-3 h-3 text-cyan-300" />
              <span className="font-mono text-[11px] text-white font-medium tabular-nums">{mounted ? time : "--:--:--"}</span>
              <span className="text-[10px] text-blue-200/50">19 Jun 2026</span>
            </div>

            <button className="relative p-2 rounded-lg bg-white/8 border border-white/10 hover:bg-white/15 transition-colors group">
              <Bell className="w-4 h-4 text-blue-100/60 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse-alert px-1">
                {alertCount}
              </span>
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-white/15">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/80 to-blue-500/80 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                SP
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white leading-tight">SP Kandhamal</p>
                <p className="text-[9px] text-blue-200/50 font-medium">Admin Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-glow" />
    </header>
  );
}
