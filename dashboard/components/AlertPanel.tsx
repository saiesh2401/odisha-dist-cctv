"use client";

import { AlertTriangle, Car, User, Users, Siren, Shield, Camera, ChevronRight } from "lucide-react";
import { recentAlerts, type Alert } from "@/lib/mock-data";
import { useState, useEffect } from "react";

const alertIcons: Record<Alert["type"], typeof AlertTriangle> = {
  stolen_vehicle: Car,
  wanted_person: User,
  fight: Siren,
  helmet: Shield,
  crowd: Users,
  tampering: Camera,
  seatbelt: Shield,
  triple_ride: Users,
  wrong_way: Car,
  missing_person: User,
};

const severityConfig = {
  critical: {
    border: "border-l-red-500",
    bg: "bg-red-50/80",
    badge: "bg-red-100 text-red-700 border border-red-200",
    dot: "bg-red-500",
    iconBg: "bg-red-100 text-red-600",
  },
  high: {
    border: "border-l-orange-500",
    bg: "bg-orange-50/80",
    badge: "bg-orange-100 text-orange-700 border border-orange-200",
    dot: "bg-orange-500",
    iconBg: "bg-orange-100 text-orange-600",
  },
  medium: {
    border: "border-l-amber-500",
    bg: "bg-amber-50/60",
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    iconBg: "bg-amber-100 text-amber-600",
  },
  low: {
    border: "border-l-blue-500",
    bg: "bg-blue-50/60",
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    iconBg: "bg-blue-100 text-blue-600",
  },
};

export default function AlertPanel() {
  const [alerts, setAlerts] = useState(recentAlerts);
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium">("all");

  useEffect(() => {
    const newAlertTypes: Alert[] = [
      {
        id: `ALT-${Date.now()}`,
        type: "helmet",
        severity: "medium",
        title: "HELMET VIOLATION",
        description: "Two-wheeler rider without helmet. Plate: OD-21-E-5678. Auto-challan generated.",
        camera: "Main Road Junction",
        cameraId: "CAM-001",
        timestamp: new Date().toISOString(),
        plateNumber: "OD-21-E-5678",
      },
      {
        id: `ALT-${Date.now()}`,
        type: "wanted_person",
        severity: "critical",
        title: "WANTED PERSON - POSSIBLE MATCH",
        description: "Potential face match detected. Confidence: 87.2%. Verifying against database...",
        camera: "Bus Stand Gate",
        cameraId: "CAM-002",
        timestamp: new Date().toISOString(),
        matchConfidence: 87.2,
      },
      {
        id: `ALT-${Date.now()}`,
        type: "seatbelt",
        severity: "medium",
        title: "SEAT BELT VIOLATION",
        description: "Driver without seat belt detected. Plate: OD-33-K-1234. Auto-challan generated.",
        camera: "NH-59 Entry Point",
        cameraId: "CAM-007",
        timestamp: new Date().toISOString(),
        plateNumber: "OD-33-K-1234",
      },
    ];

    const interval = setInterval(() => {
      const newAlert = { ...newAlertTypes[Math.floor(Math.random() * newAlertTypes.length)] };
      newAlert.id = `ALT-${Date.now()}`;
      newAlert.timestamp = new Date().toISOString();
      setAlerts((prev) => [newAlert, ...prev.slice(0, 14)]);
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 tracking-wide">Live Alerts</h3>
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold flex items-center justify-center border border-red-200">
              {alerts.length}
            </span>
          </div>
          {criticalCount > 0 && (
            <span className="text-[9px] text-red-500 font-bold animate-pulse-alert">
              {criticalCount} CRITICAL
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {(["all", "critical", "high", "medium"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                filter === f
                  ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-transparent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filtered.map((alert, i) => {
          const Icon = alertIcons[alert.type];
          const config = severityConfig[alert.severity];
          const time = new Date(alert.timestamp).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });

          return (
            <div
              key={alert.id + i}
              className={`p-2.5 rounded-xl border-l-[3px] ${config.border} ${config.bg} cursor-pointer hover:brightness-[0.97] transition-all group ${
                i === 0 ? "animate-slide-in" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-lg ${config.iconBg} flex-shrink-0 mt-0.5`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[8px] font-bold uppercase ${config.badge}`}>
                      <span className={`w-1 h-1 rounded-full ${config.dot} ${alert.severity === "critical" ? "animate-pulse" : ""}`} />
                      {alert.severity}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{time}</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 mb-0.5 leading-tight">{alert.title}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Camera className="w-2.5 h-2.5" />
                      {alert.camera}
                    </span>
                    {alert.plateNumber && (
                      <span className="px-1.5 py-[1px] rounded bg-cyan-50 text-cyan-700 text-[9px] font-mono font-bold border border-cyan-200">
                        {alert.plateNumber}
                      </span>
                    )}
                    {alert.matchConfidence && (
                      <span className="text-[9px] text-emerald-600 font-bold">
                        {alert.matchConfidence}% match
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
